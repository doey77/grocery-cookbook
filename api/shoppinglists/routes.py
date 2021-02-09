from fastapi import APIRouter, Depends

from .crud import *
from ..core.database import get_db

router = APIRouter(
    prefix="/shoppinglists",
    tags=["shoppinglists"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[ShoppingLists])
def get_shopping_lists(db: Session = Depends(get_db)):
    return crud_get_shopping_lists(db)

@router.post("/", response_model=ShoppingLists)
def create_shopping_list(shopping_list: ShoppingListsCreate, db: Session = Depends(get_db)):
    return crud_create_shopping_list(db, shopping_list=shopping_list)

@router.post("/{shoppinglist_id}/items/", response_model=ShoppingListItem)
def create_shopping_list_item(shoppinglist_id: int, shoppinglist_item: ShoppingListItemCreate, db: Session = Depends(get_db)):
    return crud_create_shopping_list_item(db, shoppinglist_item=shoppinglist_item, shoppinglist_id=shoppinglist_id)
