from sqlalchemy import Boolean, Column, Integer, String

from ..core.database import DBBase


class DBUser(DBBase):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(length=250), unique=True, index=True, nullable=False)
    hashed_password = Column(String(length=500), nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
