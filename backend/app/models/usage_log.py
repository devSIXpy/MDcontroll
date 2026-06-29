from datetime import datetime, date
from sqlalchemy import Integer, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base


class UsageLog(Base):
    __tablename__ = "usage_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
