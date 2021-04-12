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
    
    def crud_get_by_name(self, db: Session, list_name: str) -> DBShoppingLists:
        return db.query(self.model).filter(self.model.list_name == list_name).first()

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

    def crud_get_by_name_and_list(self, db: Session, *, item_name: str, list_id: int) -> DBShoppingListItem:
        return db.query(self.model).filter(
            self.model.item_name == item_name,
            self.model.list_id == list_id,
            ).first()

crud_shoppinglistitem = CRUDShoppingListItem(DBShoppingListItem)

def crud_shoppinglists_update_multi(db: Session, *,
    obj_in: ShoppingListsBatchUpdate, user_id: int) -> Dict[str, str]:
    """Updates multiple shopping lists at once. 
    Deletes any not in the list. Returns update message"""

    shopping_lists = jsonable_encoder(obj_in)['lists']
    all_user_lists = jsonable_encoder(
        crud_shoppinglists.crud_get_multi_by_user(db=db, user_id=user_id)
    )

    list_names = []
    for shop_list in all_user_lists:
        list_names.append(shop_list['list_name'])

    update_count, create_count, delete_count, unchanged_count = 0,0,0,0
    for shop_list in shopping_lists:
        if shop_list['name'] in list_names:
            # Update a list
            db_shop_list = crud_shoppinglists.crud_get_by_name(db=db, list_name=shop_list['name'])
            for item in shop_list['content']:
                # Try to retrieve item
                db_item = crud_shoppinglistitem.crud_get_by_name_and_list(
                    db=db,item_name=item['item'], list_id=db_shop_list.id
                )

                if db_item: # If item exists, update quantity if applicable
                    if db_item.quantity != item['quantity']:
                        updated_item = ShoppingListItemUpdate(
                            item_name=db_item.item_name, # unchanged
                            quantity=item['quantity'] # new qty
                        )
                        crud_shoppinglistitem.crud_update(
                            db=db,
                            db_obj=crud_shoppinglistitem.crud_get(db=db,id=db_item.id),
                            obj_in=updated_item,
                        )
                        update_count += 1
                    else:
                        unchanged_count += 1
                else: # Otherwise, create new item
                    new_item = ShoppingListItemCreate(
                        item_name=item['item'],
                        quantity=item['quantity']
                    )
                    crud_shoppinglistitem.crud_create(
                        db=db, obj_in=new_item,shoppinglist_id=db_shop_list.id
                    )
                    update_count += 1
            
            # Remove so it is marked as in JSON-sent list
            list_names.remove(shop_list['name'])
        elif shop_list['name'] not in list_names:
            # Create a new list
            new_list = ShoppingListsCreate(list_name=shop_list['name'])
            db_new_list = crud_shoppinglists.crud_create_as_user(
                db=db, obj_in=new_list, user_id=user_id
            )
            for item in shop_list['content']:
                new_item = ShoppingListItemCreate(
                    item_name=item['item'],
                    quantity=item['quantity']
                )
                crud_shoppinglistitem.crud_create(
                    db=db,obj_in=new_item,shoppinglist_id=db_new_list.id
                )
            create_count += 1

    # Now delete any lists that remain
    for name in list_names:
        # Delete list based on name
        shop_list = crud_shoppinglists.crud_get_by_name(db=db, list_name=name)
        crud_shoppinglists.crud_remove(db=db,id=shop_list.id)
        delete_count += 1

    msg = 'Created ' + str(create_count) + ' lists, updated ' 
    msg += str(update_count) + ' lists, deleted ' + str(delete_count)
    msg += ' lists, ' + str(unchanged_count) + ' lists unchanged'
    return {'msg':msg}