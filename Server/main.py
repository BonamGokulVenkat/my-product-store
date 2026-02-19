from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, database

# Initialize the database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Allow React (Frontend) to talk to this Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CRUD ROUTES ---

@app.get("/products", response_model=list[schemas.ProductResponse])
def get_all_products(db: Session = Depends(database.get_db)):
    return db.query(models.Product).all()

@app.post("/products", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(database.get_db)):
    new_product = models.Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(database.get_db)):
    item = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully"}

@app.put("/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: int, updated_data: schemas.ProductCreate, db: Session = Depends(database.get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in updated_data.dict().items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product