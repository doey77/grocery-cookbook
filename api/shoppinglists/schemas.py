from typing import List

from ..core.base_schema import APIModel


# ===== Shopping List Items =====

class ShoppingListItemBase(APIModel):
    item_name: str
    quantity: int

class ShoppingListItemCreate(ShoppingListItemBase):
    pass

class ShoppingListItemUpdate(ShoppingListItemBase):
    pass

class ShoppingListItem(ShoppingListItemBase):
    id: int
    list_id: int

# ===== Shopping List Items =====

# ===== Shopping Lists =====

class ShoppingListsBase(APIModel):
    list_name: str

class ShoppingListsCreate(ShoppingListsBase):
    pass

class ShoppingListsUpdate(ShoppingListsBase):
    pass

class ShoppingLists(ShoppingListsBase):
    id: int
    user_id: int
    shoppinglist_items: List[ShoppingListItem] = []

# ===== Shopping Lists =====