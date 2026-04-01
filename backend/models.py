from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import Base
from datetime import datetime
import uuid


class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
    age = Column(Integer)


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)

    # 🔗 Unique session link (like Google Meet code)
    session_code = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))

    # 👤 Who created the session (mentor/host)
    created_by = Column(Integer, ForeignKey("users.id"))

    # 📊 Session status
    status = Column(String, default="active")  # active / ended

    # ⏱ Timing
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)

    # 🗓 Created time
    created_at = Column(DateTime, default=datetime.utcnow)


class Invite(Base):
    __tablename__ = "invites"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(Integer, ForeignKey("sessions.id"))
    status = Column(String, default="pending")