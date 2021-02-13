from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError
from jose import jwt

from ..core.database import get_db
from ..core.auth import get_password_hash, verify_password
from ..core.settings import settings
from ..core.crud_base import CRUDBase
from ..misc_schemas.token import *


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

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login/access-token"
)

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> DBUser:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.SECURITY_ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError) as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = crud_user.crud_get(db, id=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user