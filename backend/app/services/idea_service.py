from datetime import datetime
from typing import Optional
from fastapi import HTTPException
from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from app.models.idea import Idea
from app.schemas.idea import IdeaCreate, IdeaUpdate, IdeaStatusUpdate


def list_ideas(
    db: Session,
    status: Optional[str] = None,
    category: Optional[str] = None,
) -> list[Idea]:
    stmt = select(Idea).order_by(desc(Idea.updated_at))
    if status:
        stmt = stmt.where(Idea.status == status)
    if category:
        stmt = stmt.where(Idea.category == category)
    return list(db.scalars(stmt).all())


def get_idea(db: Session, id: int) -> Idea:
    idea = db.get(Idea, id)
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    return idea


def create_idea(db: Session, data: IdeaCreate) -> Idea:
    idea = Idea(**data.model_dump())
    db.add(idea)
    db.commit()
    db.refresh(idea)
    return idea


def update_idea(db: Session, id: int, data: IdeaUpdate) -> Idea:
    idea = get_idea(db, id)
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(idea, field, value)
    idea.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(idea)
    return idea


def update_idea_status(db: Session, id: int, data: IdeaStatusUpdate) -> Idea:
    idea = get_idea(db, id)
    idea.status = data.status
    idea.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(idea)
    return idea


def delete_idea(db: Session, id: int) -> None:
    idea = get_idea(db, id)
    db.delete(idea)
    db.commit()


def list_categories(db: Session) -> list[str]:
    rows = db.execute(
        select(Idea.category).where(Idea.category.isnot(None)).distinct()
    ).scalars().all()
    return sorted(rows)
