from fastapi import FastAPI

from .core.database import engine, DBBase

from .shoppinglists.routes import router as shoppinglists_router
from .users.routes import router as users_router

DBBase.metadata.create_all(bind=engine)

tags_metadata = [
    {
        "name": "default",
        "description": "Basic operations"
    },
    {
        "name": "shoppinglists",
        "description": "Operations for interacting with shopping lists",
    },
    {
        "name": "users",
        "description": "Operations for interacting with users"
    }
]

app = FastAPI(
    title="Grocery Cookbook",
    description="This is the API for Grocery Cookbook, built with FastAPI",
    version="1.0.0",
    openapi_tags=tags_metadata,
)

app.include_router(shoppinglists_router)
app.include_router(users_router)

@app.get("/")
def greeting():
    return {"message": "Welcome to the Grocery Cookbook API. Browse docs at /docs"}