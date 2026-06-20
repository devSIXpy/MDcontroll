from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.finance import (
    CategoryCreate,
    CategoryRead,
    TransactionCreate,
    TransactionRead,
    TransactionUpdate,
)
from app.services import finance_service

router = APIRouter(prefix="/api/finances", tags=["finances"])


@router.get("/transactions", response_model=list[TransactionRead])
def list_transactions(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    return finance_service.list_transactions(db, start_date, end_date, category_id)


@router.post("/transactions", response_model=TransactionRead, status_code=201)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    return finance_service.create_transaction(db, data)


@router.get("/transactions/{id}", response_model=TransactionRead)
def get_transaction(id: int, db: Session = Depends(get_db)):
    return finance_service.get_transaction(db, id)


@router.put("/transactions/{id}", response_model=TransactionRead)
def update_transaction(id: int, data: TransactionUpdate, db: Session = Depends(get_db)):
    return finance_service.update_transaction(db, id, data)


@router.delete("/transactions/{id}", status_code=204)
def delete_transaction(id: int, db: Session = Depends(get_db)):
    finance_service.delete_transaction(db, id)


@router.get("/categories", response_model=list[CategoryRead])
def list_categories(type: Optional[str] = None, db: Session = Depends(get_db)):
    return finance_service.list_categories(db, type)


@router.post("/categories", response_model=CategoryRead, status_code=201)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    return finance_service.create_category(db, data)
