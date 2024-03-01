from pydantic import BaseModel, Field


class TaskBase(BaseModel):
    title: str = Field(..., examples=["runnning"], max_length=1024)


class Task(TaskBase):
    id: int = Field(..., gt=0, examples=[1])
    done: bool = Field(False, description="done task or not")

    class Config:
        orm_mode = True


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    done: bool = Field(False, description="done task or not")