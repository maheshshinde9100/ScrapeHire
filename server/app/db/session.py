from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
from sqlalchemy.engine.url import make_url
from app.core.config import settings


connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}


def _ensure_postgres_db(url: str):
    """If the target Postgres database does not exist, create it using the
    maintenance DB (postgres).
    """
    url_obj = make_url(url)
    target_db = url_obj.database
    if not target_db:
        return

    try:
        eng = create_engine(url, pool_pre_ping=True)
        conn = eng.connect()
        conn.close()
        eng.dispose()
        return
    except OperationalError as exc:
        msg = str(exc).lower()
        if "does not exist" not in msg:
            raise

    maintenance = url_obj.set(database="postgres")
    admin_engine = create_engine(maintenance, isolation_level="AUTOCOMMIT")
    try:
        with admin_engine.connect() as conn:
            conn.execute(text(f'CREATE DATABASE "{target_db}"'))
    finally:
        admin_engine.dispose()


if settings.DATABASE_URL.startswith("postgresql"):
    try:
        _ensure_postgres_db(settings.DATABASE_URL)
    except Exception:
        pass

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
