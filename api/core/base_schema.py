from pydantic import BaseModel, BaseConfig

class APIModel(BaseModel):
    """Base APIModel to use"""
    class Config(BaseConfig):
        orm_mode = True