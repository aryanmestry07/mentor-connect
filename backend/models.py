from sqlalchemy import Column, Integer, String,DateTime
from database import Base
from datetime import datetime

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
    age = Column(Integer)  


class Invitation(Base):
    __tablename__ = "invitations"

    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer)
    receiver_email = Column(String)
    status = Column(String, default="pending")  # pending/accepted


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer)
    student_id = Column(Integer)
    status = Column(String, default="pending")
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)