from datetime import date
from typing import Optional
from fastapi import HTTPException
from sqlalchemy import select, desc
from sqlalchemy.orm import Session, joinedload

from app.models.finance import Category, Transaction
from app.schemas.finance import CategoryCreate, TransactionCreate, TransactionUpdate


def list_categories(db: Session, type: Optional[str] = None) -> list[Category]:
    stmt = select(Category)
    if type:
        stmt = stmt.where(Category.type == type)
    return list(db.scalars(stmt).all())


def create_category(db: Session, data: CategoryCreate) -> Category:
    category = Category(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def _get_category_or_404(db: Session, category_id: int) -> Category:
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


def _load_transaction(db: Session, id: int) -> Transaction:
    stmt = (
        select(Transaction)
        .options(joinedload(Transaction.category))
        .where(Transaction.id == id)
    )
    transaction = db.scalars(stmt).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


def list_transactions(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None,
) -> list[Transaction]:
    stmt = (
        select(Transaction)
        .options(joinedload(Transaction.category))
        .order_by(desc(Transaction.date), desc(Transaction.created_at))
    )
    if start_date:
        stmt = stmt.where(Transaction.date >= start_date)
    if end_date:
        stmt = stmt.where(Transaction.date <= end_date)
    if category_id:
        stmt = stmt.where(Transaction.category_id == category_id)
    return list(db.scalars(stmt).unique().all())


def get_transaction(db: Session, id: int) -> Transaction:
    return _load_transaction(db, id)


def create_transaction(db: Session, data: TransactionCreate) -> Transaction:
    category = _get_category_or_404(db, data.category_id)
    if category.type != data.type:
        raise HTTPException(
            status_code=422,
            detail=f"Transaction type '{data.type}' does not match category type '{category.type}'",
        )
    transaction = Transaction(**data.model_dump())
    db.add(transaction)
    db.commit()
    return _load_transaction(db, transaction.id)


def update_transaction(db: Session, id: int, data: TransactionUpdate) -> Transaction:
    transaction = _load_transaction(db, id)
    updates = data.model_dump(exclude_unset=True)

    new_type = updates.get("type", transaction.type)
    new_category_id = updates.get("category_id", transaction.category_id)

    if "category_id" in updates or "type" in updates:
        category = _get_category_or_404(db, new_category_id)
        if category.type != new_type:
            raise HTTPException(
                status_code=422,
                detail=f"Transaction type '{new_type}' does not match category type '{category.type}'",
            )

    for field, value in updates.items():
        setattr(transaction, field, value)

    db.commit()
    return _load_transaction(db, transaction.id)


def delete_transaction(db: Session, id: int) -> None:
    transaction = _load_transaction(db, id)
    db.delete(transaction)
    db.commit()
