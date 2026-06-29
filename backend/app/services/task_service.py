from datetime import datetime, date
from typing import Optional
from fastapi import HTTPException
from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate


def list_tasks(
    db: Session,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    project: Optional[str] = None,
) -> list[Task]:
    stmt = select(Task).order_by(
        Task.status.asc(),
        Task.priority.desc(),
        desc(Task.created_at),
    )
    if status:
        stmt = stmt.where(Task.status == status)
    if priority:
        stmt = stmt.where(Task.priority == priority)
    if project:
        stmt = stmt.where(Task.project == project)
    return list(db.scalars(stmt).all())


def get_task(db: Session, id: int) -> Task:
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


def create_task(db: Session, data: TaskCreate) -> Task:
    task = Task(**data.model_dump())
    if task.status == "done":
        task.completed_at = datetime.utcnow()
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, id: int, data: TaskUpdate) -> Task:
    task = get_task(db, id)
    updates = data.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(task, field, value)

    if "status" in updates:
        if updates["status"] == "done" and not task.completed_at:
            task.completed_at = datetime.utcnow()
        elif updates["status"] != "done":
            task.completed_at = None

    db.commit()
    db.refresh(task)
    return task


def update_task_status(db: Session, id: int, data: TaskStatusUpdate) -> Task:
    task = get_task(db, id)
    task.status = data.status
    if data.status == "done":
        task.completed_at = datetime.utcnow()
    else:
        task.completed_at = None
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, id: int) -> None:
    task = get_task(db, id)
    db.delete(task)
    db.commit()


def list_projects(db: Session) -> list[str]:
    rows = db.execute(
        select(Task.project).where(Task.project.isnot(None)).distinct()
    ).scalars().all()
    return sorted(rows)
