from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.idea import IdeaCreate, IdeaRead, IdeaStatusUpdate, IdeaUpdate
from app.services import idea_service

router = APIRouter(prefix="/api/ideas", tags=["ideas"])


@router.get("", response_model=list[IdeaRead])
def list_ideas(
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return idea_service.list_ideas(db, status, category)


@router.post("", response_model=IdeaRead, status_code=201)
def create_idea(data: IdeaCreate, db: Session = Depends(get_db)):
    return idea_service.create_idea(db, data)


@router.get("/categories", response_model=list[str])
def list_categories(db: Session = Depends(get_db)):
    return idea_service.list_categories(db)


@router.get("/{id}", response_model=IdeaRead)
def get_idea(id: int, db: Session = Depends(get_db)):
    return idea_service.get_idea(db, id)


@router.put("/{id}", response_model=IdeaRead)
def update_idea(id: int, data: IdeaUpdate, db: Session = Depends(get_db)):
    return idea_service.update_idea(db, id, data)


@router.patch("/{id}/status", response_model=IdeaRead)
def update_idea_status(id: int, data: IdeaStatusUpdate, db: Session = Depends(get_db)):
    return idea_service.update_idea_status(db, id, data)


@router.delete("/{id}", status_code=204)
def delete_idea(id: int, db: Session = Depends(get_db)):
    idea_service.delete_idea(db, id)
