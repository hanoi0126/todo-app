from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.ext.asyncio import AsyncSession
from app.backend.api.schema import task as task_schema, user as user_schema
from app.backend.api.db import get_db
from app.backend.api.cruds import task as task_crud
from app.backend.api.libs import authenticate


router = APIRouter(prefix="/tasks", tags=["task"])


@router.get("", response_model=list[task_schema.Task])
async def list_tasks(
    current_user: user_schema.User = Depends(authenticate.get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    return await task_crud.get_tasks(db, current_user.id)


@router.post("", response_model=task_schema.Task)
async def create_task(
    task_body: task_schema.TaskCreate,
    current_user: user_schema.User = Depends(authenticate.get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    return await task_crud.create_task(db, task_body, current_user.id)


@router.put("/{task_id}", response_model=task_schema.Task)
async def update_task(
    task_body: task_schema.TaskUpdate,
    task_id: int = Path(..., gt=0),
    current_user: user_schema.User = Depends(authenticate.get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    task = await task_crud.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=401, detail="Not authenticated for updating this task")
    task.title = task_body.title
    task.done = task_body.done
    return await task_crud.update_task(db, task)


@router.delete("/{task_id}", response_model=None)
async def delete_task(
    task_id: int = Path(..., gt=0),
    db: AsyncSession = Depends(get_db),
    current_user: user_schema.User = Depends(authenticate.get_current_active_user)
):
    task = await task_crud.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=401, detail="Not authenticated for deleting this task")
    await task_crud.delete_task(db, task)
