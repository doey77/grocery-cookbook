from typing import Dict, List

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

# ===== Batch Update =====

class ShoppingListItemBatchUpdate(APIModel):
    item: str
    quantity: int

class ShoppingListBatchUpdate(APIModel):
    name: str
    content: List[ShoppingListItemBatchUpdate]

class ShoppingListsBatchUpdate(APIModel):
    """Schema for a batch update of shopping lists, including both the name and contents of each list"""
    lists: List[ShoppingListBatchUpdate]

# ===== Batch Update =====