from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.task import TaskCreate, TaskRead, TaskStatusUpdate, TaskUpdate
from app.services import task_service

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead])
def list_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    project: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return task_service.list_tasks(db, status, priority, project)


@router.post("", response_model=TaskRead, status_code=201)
def create_task(data: TaskCreate, db: Session = Depends(get_db)):
    return task_service.create_task(db, data)


@router.get("/projects", response_model=list[str])
def list_projects(db: Session = Depends(get_db)):
    return task_service.list_projects(db)


@router.get("/{id}", response_model=TaskRead)
def get_task(id: int, db: Session = Depends(get_db)):
    return task_service.get_task(db, id)


@router.put("/{id}", response_model=TaskRead)
def update_task(id: int, data: TaskUpdate, db: Session = Depends(get_db)):
    return task_service.update_task(db, id, data)


@router.patch("/{id}/status", response_model=TaskRead)
def update_task_status(id: int, data: TaskStatusUpdate, db: Session = Depends(get_db)):
    return task_service.update_task_status(db, id, data)


@router.delete("/{id}", status_code=204)
def delete_task(id: int, db: Session = Depends(get_db)):
    task_service.delete_task(db, id)
