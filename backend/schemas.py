from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# =========================
# 👤 USER SCHEMAS
# =========================

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str  # student / mentor
    age: int


# =========================
# 🔗 SESSION SCHEMAS
# =========================

# Create Session (no input needed, backend generates link)
class SessionCreate(BaseModel):
    pass


# Response when session is created
class SessionResponse(BaseModel):
    id: int
    session_code: str
    created_by: int
    status: str
    start_time: datetime
    end_time: Optional[datetime]

    class Config:
        orm_mode = True


# Join session using link
class SessionJoin(BaseModel):
    session_code: str


# End session
class SessionEnd(BaseModel):
    session_code: str


# =========================
# 📩 INVITE SCHEMAS (OPTIONAL)
# =========================

class InviteCreate(BaseModel):
    receiver_id: int


class InviteResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    status: str

    class Config:
        orm_mode = True