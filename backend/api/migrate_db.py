from sqlalchemy import create_engine
from app.backend.api.models.model import Base

DB_URL = ""
engine = create_engine(DB_URL, echo=True)


def reset_database():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


if __name__ == "__main__":
    reset_database()