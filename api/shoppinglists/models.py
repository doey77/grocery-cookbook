from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..core.database import DBBase
from ..users.models import DBUser

# Prepend models with DB to prevent confusion with schemas

class DBShoppingLists(DBBase):
    __tablename__ = "shoppinglist_lists"

    id = Column(Integer, primary_key=True, index=True)
    list_name = Column(String(length=100), index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    shoppinglist_items = relationship("DBShoppingListItem", back_populates="shoppinglist")

class DBShoppingListItem(DBBase):
    __tablename__ = "shoppinglist_items"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(length=100), index=True)
    quantity = Column(Integer, index=True)
    list_id = Column(Integer, ForeignKey("shoppinglist_lists.id"))

    shoppinglist = relationship("DBShoppingLists", back_populates="shoppinglist_items")