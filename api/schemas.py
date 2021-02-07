from typing import List, Optional

from pydantic import BaseModel, BaseConfig


class APIModel(BaseModel):
    """Base APIModel to use"""
    class Config(BaseConfig):
        orm_mode = True

class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    items: List[Item] = []

    class Config:
        orm_mode = True

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