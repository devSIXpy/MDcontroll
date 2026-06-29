from datetime import datetime, date
from typing import Literal, Optional
from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Literal["pending", "in_progress", "done", "cancelled"] = "pending"
    priority: Literal["low", "medium", "high"] = "medium"
    due_date: Optional[date] = None
    is_recurring: bool = False
    recurrence: Optional[Literal["daily", "weekly", "monthly"]] = None
    project: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Literal["pending", "in_progress", "done", "cancelled"]] = None
    priority: Optional[Literal["low", "medium", "high"]] = None
    due_date: Optional[date] = None
    is_recurring: Optional[bool] = None
    recurrence: Optional[Literal["daily", "weekly", "monthly"]] = None
    project: Optional[str] = None


class TaskStatusUpdate(BaseModel):
    status: Literal["pending", "in_progress", "done", "cancelled"]


class TaskRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[date]
    is_recurring: bool
    recurrence: Optional[str]
    project: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    model_config = {"from_attributes": True}
