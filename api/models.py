from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    items = relationship("Item", back_populates="owner")


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")

class ShoppingLists(Base):
    __tablename__ = "shoppinglist_lists"

    id = Column(Integer, primary_key=True, index=True)
    list_name = Column(String(length=100), index=True)

    shoppinglist_items = relationship("ShoppingListItem", back_populates="shoppinglist")

class ShoppingListItem(Base):
    __tablename__ = "shoppinglist_items"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(length=100), index=True)
    quantity = Column(Integer, index=True)
    list_id = Column(Integer, ForeignKey("shoppinglist_lists.id"))

    shoppinglist = relationship("ShoppingLists", back_populates="shoppinglist_items")