from pydantic import BaseModel


class FinanceBlock(BaseModel):
    total_income: float
    total_expense: float
    balance: float


class TaskBlock(BaseModel):
    total: int
    pending: int
    in_progress: int
    overdue: int
    done_this_month: int


class IdeaBlock(BaseModel):
    total: int
    raw: int


class DashboardSummary(BaseModel):
    finance: FinanceBlock
    tasks: TaskBlock
    ideas: IdeaBlock
    streak_days: int
    progress_index: float
