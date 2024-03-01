from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.engine import Result
from app.backend.api.schema import user as user_schema
from app.backend.api.models import model


async def create_user(db: AsyncSession, from_data: user_schema.UserCreate) -> model.User:
    user = model.User(**from_data.dict())
    user.activeted = True
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def get_user(db: AsyncSession, username: str) -> model.User | None:
    stmt = select(model.User).where(model.User.username == username)
    result: Result = await db.execute(stmt)
    return result.scalar()