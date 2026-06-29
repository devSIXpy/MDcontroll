from datetime import datetime, date
from typing import Optional
from sqlalchemy import String, Boolean, Integer, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending", nullable=False)
    priority: Mapped[str] = mapped_column(String, default="medium", nullable=False)
    due_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    is_recurring: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    recurrence: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    project: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
