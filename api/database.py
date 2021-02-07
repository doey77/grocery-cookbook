from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# postgresql://<user>:<password>@<server_addr>/<database_name>
USERNAME = "grocery-fastapi"
PASSWORD = "4XEmLjs5!SW2npUXF&hW"
SERVER = "127.0.0.1"
DATABASE = "grocery-fastapi"
SQLALCHEMY_DATABASE_URL = "postgresql://" + USERNAME + ":" + PASSWORD + "@" + SERVER + "/" + DATABASE

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()