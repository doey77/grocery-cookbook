from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from ..core.crud_base import CRUDBase
from .schemas import *
from .models import *


class CRUDShoppingLists(CRUDBase[DBShoppingLists, ShoppingListsCreate, ShoppingListsUpdate]):
    def crud_create_as_user(
        self, db: Session, *, obj_in: ShoppingListItemCreate, user_id: int
    ) -> DBShoppingLists:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def crud_get_multi_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[DBShoppingLists]:
        return (
            db.query(self.model)
            .filter(DBShoppingLists.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

crud_shoppinglists = CRUDShoppingLists(DBShoppingLists)

class CRUDShoppingListItem(CRUDBase[DBShoppingListItem, ShoppingListItemCreate, ShoppingListItemUpdate]):
    def crud_create(self, db: Session, *,
        obj_in: ShoppingListItemCreate,
        shoppinglist_id: int) -> DBShoppingListItem:
        """Overwrite create to include shoppinglist_id"""
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, list_id=shoppinglist_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

crud_shoppinglistitem = CRUDShoppingListItem(DBShoppingListItem)