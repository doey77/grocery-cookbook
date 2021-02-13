from fastapi import FastAPI

from .core.database import engine, DBBase
from .core.settings import settings

from .shoppinglists.routes import router as shoppinglists_router
from .users.routes import router as users_router
from .core.routes import router as core_router
from .core.routes import auth_router

DBBase.metadata.create_all(bind=engine)

tags_metadata = [
    {
        "name": "default",
        "description": "Basic operations"
    },
    {
        "name": "auth",
        "description": "Authorization operations"
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
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

@app.get("/")
def base_domain_greeting():
    return {"message": "Welcome to the Grocery Cookbook API. Browse docs at /docs"}

app.include_router(core_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(shoppinglists_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
