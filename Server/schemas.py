from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass  # Used for creating

class ProductResponse(ProductBase):
    id: int  # The database gives us an ID
    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy models