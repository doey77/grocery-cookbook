from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from ..core.database import get_db
from .crud import *
from .schemas import *
from .models import *

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[User])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,) -> Any:
    """
    Retrieve users.
    """
    users = crud_user.crud_get_multi(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=User)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,) -> Any:
    """
    Create new user.
    """
    user = crud_user.crud_get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="That email is already registered.",
        )
    user = crud_user.crud_create(db, obj_in=user_in)
    return user


@router.put("/me", response_model=User)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    password: str = Body(None),
    email: EmailStr = Body(None),
    current_user: DBUser = Depends(get_current_user)) -> Any:
    """
    Update own user.
    """
    current_user_data = jsonable_encoder(current_user)
    user_in = UserUpdate(**current_user_data)
    if password is not None:
        user_in.password = password
    if email is not None:
        user_in.email = email
    user = crud_user.crud_update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/me", response_model=User)
def read_user_me(
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.post("/open", response_model=User)
def create_user_open(
    *,
    db: Session = Depends(get_db),
    password: str = Body(...),
    email: EmailStr = Body(...),
) -> Any:
    """
    Create new user without the need to be logged in.
    """
    if not settings.USERS_OPEN_REGISTRATION:
        raise HTTPException(
            status_code=403,
            detail="Open user registration is forbidden on this server",
        )
    user = crud_user.crud_get_by_email(db, email=email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )
    user_in = UserCreate(password=password, email=email)
    user = crud_user.crud_create(db, obj_in=user_in)
    return user


@router.get("/{user_id}", response_model=User)
def read_user_by_id(
    user_id: int,
    current_user: DBUser = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user = crud_user.crud_get(db, id=user_id)
    if user == current_user:
        return user
    if not crud_user.crud_is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return user


@router.put("/{user_id}", response_model=User)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user: DBUser = Depends(get_current_user),
) -> Any:
    """
    Update a user.
    """
    user = crud_user.crud_get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system",
        )
    user = crud_user.crud_update(db, db_obj=user, obj_in=user_in)
    return user
