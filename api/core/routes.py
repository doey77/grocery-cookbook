from datetime import timedelta, datetime
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .settings import settings
from .utils import (
    generate_password_reset_token,
    send_reset_password_email,
    verify_password_reset_token
)
from .database import get_db
from ..users.crud import *
from ..users.schemas import *
from ..users.models import *
from ..misc_schemas.msg import *
from ..misc_schemas.token import *
from .auth import create_access_token, get_password_hash

# Place base routes here

router = APIRouter()

@router.get("/")
def greeting():
    return {"message": "Welcome to the Grocery Cookbook API. Browse docs at /docs"}

auth_router = APIRouter(
    prefix="/auth",
    tags=['auth'],
    responses={404: {"description": "Not found"}},
)

# ===== Authentication Routes =====
@auth_router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud_user.crud_authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not crud_user.crud_is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expires_utc = datetime.utcnow() + access_token_expires
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "Bearer",
        "expires": expires_utc.strftime("%Y-%m-%dT%H:%M"),
    }


@auth_router.post("/login/test-token", response_model=User)
def test_token(current_user: DBUser = Depends(get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user


@auth_router.post("/password-recovery/{email}", response_model=Msg)
def recover_password(email: str, db: Session = Depends(get_db)) -> Any:
    """
    Password Recovery
    """
    user = crud_user.crud_get_by_email(db, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    send_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )
    return {"msg": "Password recovery email sent"}


@auth_router.post("/reset-password/", response_model=Msg)
def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(get_db),
) -> Any:
    """
    Reset password
    """
    email = verify_password_reset_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud_user.crud_get_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    elif not crud_user.crud_is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
    hashed_password = get_password_hash(new_password)
    user.hashed_password = hashed_password
    db.add(user)
    db.commit()
    return {"msg": "Password updated successfully"}

# ===== Authentication Routes =====