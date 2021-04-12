from fastapi import APIRouter, Depends, HTTPException

from .crud import *
from ..core.database import get_db
from ..users.crud import get_current_user

router = APIRouter(
    prefix="/shoppinglists",
    tags=["shoppinglists"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[ShoppingLists])
def get_shopping_lists(
    *,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: DBUser = Depends(get_current_user)):
    """Get shopping lists for the logged in user"""
    shoppinglist = crud_shoppinglists.crud_get_multi_by_user(db=db, user_id=current_user.id, skip=skip, limit=limit)
    return shoppinglist

@router.post("/",)
def update_and_remove_shopping_lists(
    *,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
    shoppinglist_in: ShoppingListsBatchUpdate,):
    """Update shopping lists all at once (deletes any not in list)"""
    shoppinglists = crud_shoppinglists_update_multi(db=db, obj_in=shoppinglist_in, user_id=current_user.id)
    return shoppinglists