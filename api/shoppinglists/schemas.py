from typing import List

from ..core.base_schema import APIModel


class ShoppingListItemBase(APIModel):
    item_name: str
    quantity: int

class ShoppingListItemCreate(ShoppingListItemBase):
    pass

class ShoppingListItem(ShoppingListItemBase):
    id: int
    list_id: int

class ShoppingListsBase(APIModel):
    list_name: str

class ShoppingListsCreate(ShoppingListsBase):
    pass

class ShoppingLists(ShoppingListsBase):
    id: int
    shoppinglist_items: List[ShoppingListItem] = []