from sqlalchemy.orm import Session

from .schemas import *
from .models import *

# Prepend crud functions with crud_ to avoid confusion with routes

def crud_create_shopping_list(db: Session, shopping_list: ShoppingListsCreate) -> Session.query:
    """Create a shopping list

    Args:
        db (Session): Database session
        shopping_list (ShoppingListsCreate): Schema

    Returns:
        Session.query: Query result
    """
    db_list = DBShoppingLists(**shopping_list.dict())
    db.add(db_list)
    db.commit()
    db.refresh(db_list)
    return db_list

def crud_create_shopping_list_item(db: Session, shoppinglist_item: ShoppingListItemCreate, shoppinglist_id: int) -> Session.query:
    """Create an item on a shopping list

    Args:
        db (Session): Database session
        shoppinglist_item (ShoppingListItemCreate): Schema
        shoppinglist_id (int): ID of Shopping list to append item to

    Returns:
        Session.query: Query result
    """
    db_list_item = DBShoppingListItem(**shoppinglist_item.dict(), list_id=shoppinglist_id)
    db.add(db_list_item)
    db.commit()
    db.refresh(db_list_item)
    return db_list_item

def crud_get_shopping_lists(db: Session) -> Session.query:
    """Gets all shopping lists with contents

    Args:
        db (Session): Database session

    Returns:
        Session.query: Query result
    """
    return db.query(DBShoppingLists).all()