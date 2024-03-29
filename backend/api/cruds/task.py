from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.engine import Result
from app.backend.api.models import model
from app.backend.api.schema import task as task_schema


async def create_task(
    db: AsyncSession,
    task_create: task_schema.TaskCreate,
    user_id: int
) -> model.Task:
    task = model.Task(**task_create.dict(), owner_id=user_id)
    task.done = False
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


async def get_task(db: AsyncSession, id: int) -> model.Task | None:
    stmt = select(model.Task).where(model.Task.id == id)
    result: Result = await db.execute(stmt)
    return result.scalar()


async def get_tasks(db: AsyncSession, id: int) -> list[task_schema.Task]:
    stmt = select(model.Task).where(model.Task.owner_id == id)
    result: Result = await db.execute(stmt)
    return result.scalars().all()


async def update_task(
    db: AsyncSession, task: model.Task
) -> model.Task:
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


async def delete_task(db: AsyncSession, task: model.Task) -> None:
    await db.delete(task)
    await db.commit()