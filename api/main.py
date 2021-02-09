from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext

from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database.initialize import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================ Authentication ================

@app.get("/token/")
def read_token(token: str = Depends(oauth2_scheme)):
    return {"token": token}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)

@app.post("/token/")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user_dict = crud.get_user_by_email(db=db, email=form_data.username)
    if not user_dict:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    password = form_data.password
    if not password == user_dict.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user_dict.email, "token_type": "bearer"}

# ================ Authentication ================

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/items/", response_model=schemas.Item)
def create_item_for_user(
    user_id: int, item: schemas.ItemCreate, db: Session = Depends(get_db)
):
    return crud.create_user_item(db=db, item=item, user_id=user_id)


@app.get("/items/", response_model=List[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_items(db, skip=skip, limit=limit)
    return items

@app.post("/shoppinglist/", response_model=schemas.ShoppingLists)
def create_shopping_list(shopping_list: schemas.ShoppingListsCreate, db: Session = Depends(get_db)):
    return crud.create_shopping_list(db=db, shopping_list=shopping_list)

@app.post("/shoppinglist/{shoppinglist_id}/items/", response_model=schemas.ShoppingListItem)
def create_shopping_list_item(shoppinglist_id: int, shoppinglist_item: schemas.ShoppingListItemCreate, db: Session = Depends(get_db)):
    return crud.create_shopping_list_item(db=db, shoppinglist_item=shoppinglist_item, shoppinglist_id=shoppinglist_id)

@app.get("/shoppinglist/", response_model=List[schemas.ShoppingLists])
def get_shopping_lists(db: Session = Depends(get_db)):
    return crud.get_shopping_lists(db=db)