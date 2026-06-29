from datetime import date, timedelta
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.finance import Transaction
from app.models.idea import Idea
from app.models.task import Task
from app.models.usage_log import UsageLog


def log_usage(db: Session) -> None:
    today = date.today()
    exists = db.scalars(select(UsageLog).where(UsageLog.date == today)).first()
    if not exists:
        db.add(UsageLog(date=today))
        db.commit()


def _compute_streak(db: Session) -> int:
    rows = db.execute(
        select(UsageLog.date).order_by(UsageLog.date.desc())
    ).scalars().all()

    if not rows:
        return 0

    streak = 0
    expected = date.today()
    for logged_date in rows:
        if logged_date == expected:
            streak += 1
            expected -= timedelta(days=1)
        elif logged_date < expected:
            break

    return streak


def get_summary(db: Session) -> dict:
    log_usage(db)

    today = date.today()
    month_start = today.replace(day=1)

    income_row = db.execute(
        select(func.sum(Transaction.amount)).where(
            Transaction.type == "income",
            Transaction.date >= month_start,
            Transaction.date <= today,
        )
    ).scalar() or 0.0

    expense_row = db.execute(
        select(func.sum(Transaction.amount)).where(
            Transaction.type == "expense",
            Transaction.date >= month_start,
            Transaction.date <= today,
        )
    ).scalar() or 0.0

    tasks_total = db.execute(
        select(func.count(Task.id)).where(Task.status.notin_(["cancelled"]))
    ).scalar() or 0

    tasks_pending = db.execute(
        select(func.count(Task.id)).where(Task.status == "pending")
    ).scalar() or 0

    tasks_in_progress = db.execute(
        select(func.count(Task.id)).where(Task.status == "in_progress")
    ).scalar() or 0

    tasks_overdue = db.execute(
        select(func.count(Task.id)).where(
            Task.due_date < today,
            Task.status.notin_(["done", "cancelled"]),
        )
    ).scalar() or 0

    tasks_done_month = db.execute(
        select(func.count(Task.id)).where(
            Task.status == "done",
            Task.completed_at >= month_start,
        )
    ).scalar() or 0

    ideas_total = db.execute(select(func.count(Idea.id))).scalar() or 0

    ideas_raw = db.execute(
        select(func.count(Idea.id)).where(Idea.status == "raw")
    ).scalar() or 0

    active = tasks_pending + tasks_in_progress + tasks_done_month
    progress_index = round((tasks_done_month / active) * 100, 1) if active > 0 else 0.0

    return {
        "finance": {
            "total_income": float(income_row),
            "total_expense": float(expense_row),
            "balance": float(income_row) - float(expense_row),
        },
        "tasks": {
            "total": tasks_total,
            "pending": tasks_pending,
            "in_progress": tasks_in_progress,
            "overdue": tasks_overdue,
            "done_this_month": tasks_done_month,
        },
        "ideas": {
            "total": ideas_total,
            "raw": ideas_raw,
        },
        "streak_days": _compute_streak(db),
        "progress_index": progress_index,
    }
