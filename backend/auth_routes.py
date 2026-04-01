from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import UserDB
from auth import verify_password, create_access_token

router = APIRouter(tags=["Auth"])


#  SCHEMAS
class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str  # student / mentor
    age: int


#  LOGIN
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == data.email).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": user.id})

    return {
        "access_token": token,
        "role": user.role,
        "user_id": user.id
    }


#  REGISTER
@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(UserDB).filter(UserDB.email == data.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    # ⚠️ NOTE: plain password (hash later)
    new_user = UserDB(
        name=data.name,
        email=data.email,
        password=data.password,
        role=data.role,
        age=data.age
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully 🚀"}