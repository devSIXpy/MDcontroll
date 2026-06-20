from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.finance import Category

_DEFAULT_CATEGORIES = [
    {"name": "Salário",      "type": "income",  "color": "#3DAA6D"},
    {"name": "Freelance",    "type": "income",  "color": "#6C63FF"},
    {"name": "Investimento", "type": "income",  "color": "#F5A623"},
    {"name": "Outros",       "type": "income",  "color": "#888888"},
    {"name": "Alimentação",  "type": "expense", "color": "#E05C5C"},
    {"name": "Transporte",   "type": "expense", "color": "#F5A623"},
    {"name": "Moradia",      "type": "expense", "color": "#574FCC"},
    {"name": "Saúde",        "type": "expense", "color": "#3DAA6D"},
    {"name": "Lazer",        "type": "expense", "color": "#6C63FF"},
    {"name": "Assinatura",   "type": "expense", "color": "#888888"},
    {"name": "Educação",     "type": "expense", "color": "#F0F0F0"},
    {"name": "Outros",       "type": "expense", "color": "#444444"},
]


def seed_categories(db: Session) -> None:
    existing = {(c.name, c.type) for c in db.scalars(select(Category)).all()}
    new_categories = [
        Category(**cat)
        for cat in _DEFAULT_CATEGORIES
        if (cat["name"], cat["type"]) not in existing
    ]
    if new_categories:
        db.add_all(new_categories)
        db.commit()
