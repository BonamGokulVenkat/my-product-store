from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Create the database file (it will appear as store.db)
SQLALCHEMY_DATABASE_URL = "sqlite:///./store.db"

# 2. Set up the engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# 3. Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Create the Base class for models to inherit from
Base = declarative_base()

# 5. Dependency to get the database for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()