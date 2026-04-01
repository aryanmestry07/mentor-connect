from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./test.db"

# 🔥 UPDATED ENGINE (IMPORTANT)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},

    # 🔥 FIX CONNECTION POOL ISSUE
    pool_size=10,        # default 5 → increased
    max_overflow=20,     # allow extra connections
    pool_timeout=30,     # wait time
    pool_recycle=1800    # refresh connections
)

# ✅ SESSION CONFIG (GOOD)
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

Base = declarative_base()

# ✅ DB DEPENDENCY
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()