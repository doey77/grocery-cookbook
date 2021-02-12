from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from ..core.config import get_password_hash, verify_password

from ..core.crud_base import CRUDBase

from .models import *
from .schemas import *


class CRUDUser(CRUDBase[DBUser, UserCreate, UserUpdate]):
    def crud_get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(DBUser).filter(DBUser.email == email).first()

    def crud_create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = DBUser(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            is_superuser=obj_in.is_superuser,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def crud_update(
        self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        if update_data["password"]:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def crud_authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = self.crud_get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def crud_is_active(self, user: User) -> bool:
        return user.is_active

    def crud_is_superuser(self, user: User) -> bool:
        return user.is_superuser


crud_user = CRUDUser(DBUser)
