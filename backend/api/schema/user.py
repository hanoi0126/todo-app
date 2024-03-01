from pydantic import BaseModel, Field


class UserBase(BaseModel):
    username: str = Field(...)


class User(UserBase):
    id: int = Field(...)
    email: str = Field(...)
    activeted: bool = Field(False, description="user is activeted or not")

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    email: str = Field(...)
    password: str = Field(...)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None