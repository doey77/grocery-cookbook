from ..users.models import *
from ..users.schemas import *
from ..users.crud import *

from ..misc_schemas.token import *

from .database import get_db
from fastapi import Depends, HTTPException, status
from jose import jwt
from pydantic import ValidationError
from .settings import settings
from .config import reusable_oauth2

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