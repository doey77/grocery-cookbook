from fastapi import FastAPI

from .core.database import engine
from .core.base_model import Base

from .shoppinglists.routes import router as shoppinglists_router

tags_metadata = [
    {
        "name": "default",
        "description": "Basic operations"
    },
    {
        "name": "shoppinglists",
        "description": "Operations for interacting with shopping lists",
    }
]

app = FastAPI(
    title="Grocery Cookbook",
    description="This is the API for Grocery Cookbook, built with FastAPI",
    version="1.0.0",
    openapi_tags=tags_metadata,
)

app.include_router(shoppinglists_router)

@app.get("/")
def greeting():
    return {"message": "Welcome to the Grocery Cookbook API. Browse docs at /docs"}

Base.metadata.create_all(bind=engine)