from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi import Depends

# postgresql://<user>:<password>@<server_addr>/<database_name>
USERNAME = "grocery-fastapi"
PASSWORD = "4XEmLjs5!SW2npUXF&hW"
SERVER = "127.0.0.1"
DATABASE = "grocery-fastapi"
SQLALCHEMY_DATABASE_URL = "postgresql://" + USERNAME + ":" + PASSWORD + "@" + SERVER + "/" + DATABASE

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db: Session = Depends(get_db())