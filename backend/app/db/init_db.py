from sqlalchemy.orm import Session


def init_db(db: Session) -> None:
    # Reserved for seeding initial data (e.g. default categories) in future phases.
    # Do NOT create tables here — schema is managed exclusively by Alembic.
    pass
