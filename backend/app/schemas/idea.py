from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel


class IdeaCreate(BaseModel):
    title: str
    body: Optional[str] = None
    status: Literal["raw", "refining", "planning", "executing", "archived"] = "raw"
    category: Optional[str] = None
    linked_task_id: Optional[int] = None


class IdeaUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    status: Optional[Literal["raw", "refining", "planning", "executing", "archived"]] = None
    category: Optional[str] = None
    linked_task_id: Optional[int] = None


class IdeaStatusUpdate(BaseModel):
    status: Literal["raw", "refining", "planning", "executing", "archived"]


class IdeaRead(BaseModel):
    id: int
    title: str
    body: Optional[str]
    status: str
    category: Optional[str]
    linked_task_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
