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

@router.post("/", response_model=ShoppingLists)
def create_shopping_list(
    *,
    db: Session = Depends(get_db),
    shoppinglist_in: ShoppingListsCreate,
    current_user: DBUser = Depends(get_current_user)):
    """Create shopping list with logged in user as owner"""
    shoppinglist = crud_shoppinglists.crud_create_as_user(db=db, obj_in=shoppinglist_in, user_id=current_user.id)
    return shoppinglist

@router.post("/{shoppinglist_id}/items/", response_model=ShoppingListItem)
def create_shopping_list_item(
    *,
    db: Session = Depends(get_db),
    shoppinglistitem_in: ShoppingListItemCreate,
    shoppinglist_id: int,
    current_user: DBUser = Depends(get_current_user)):
    """Create an item for the specified list"""
    shoppinglist = crud_shoppinglists.crud_get(db=db, id=shoppinglist_id)
    if shoppinglist.user_id == current_user.id:
        shoppinglistitem = crud_shoppinglistitem.crud_create(db=db,
            obj_in=shoppinglistitem_in, shoppinglist_id=shoppinglist_id)
        return shoppinglistitem
    else:
        raise HTTPException(status_code=403, detail="That shopping list isn't owned by that user.")