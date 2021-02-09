from fastapi import FastAPI

from .core.database import engine
from .core.base_model import Base

from .shoppinglists.routes import router as shoppinglists_router

app = FastAPI()

app.include_router(shoppinglists_router)

Base.metadata.create_all(bind=engine)