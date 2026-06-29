from datetime import datetime, date
from typing import Literal, Optional
from pydantic import BaseModel, field_validator


class CategoryCreate(BaseModel):
    name: str
    type: Literal["income", "expense"]
    color: str


class CategoryRead(BaseModel):
    id: int
    name: str
    type: Literal["income", "expense"]
    color: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TransactionCreate(BaseModel):
    type: Literal["income", "expense"]
    amount: float
    category_id: int
    description: Optional[str] = None
    date: date

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("amount must be greater than 0")
        return v


class TransactionUpdate(BaseModel):
    type: Optional[Literal["income", "expense"]] = None
    amount: Optional[float] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    date: Optional[date] = None

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError("amount must be greater than 0")
        return v


class TransactionRead(BaseModel):
    id: int
    type: Literal["income", "expense"]
    amount: float
    category_id: int
    category: CategoryRead
    description: Optional[str]
    date: date
    created_at: datetime

    model_config = {"from_attributes": True}


class MonthlyBalanceItem(BaseModel):
    month: int
    income: float
    expense: float
    balance: float


class FinanceSummary(BaseModel):
    total_income: float
    total_expense: float
    balance: float
    transaction_count: int
