from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import User
from auth import verify_password, create_access_token

router = APIRouter(tags=["Auth"])


# 📦 SCHEMAS
class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str  # student / mentor


# 🔐 LOGIN
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": user.id})

    return {"access_token": token}


# 🆕 REGISTER
@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.username == data.username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # ⚠️ NOTE: plain password (we’ll secure later)
    new_user = User(
        username=data.username,
        password=data.password,
        role=data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully 🚀"}