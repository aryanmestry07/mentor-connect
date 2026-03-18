from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, SessionLocal
from models import Base, UserDB


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()


# ---------------- DB Dependency ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- Pydantic Model ----------------
class User(BaseModel):
    name: str
    email: str
    role: str
    age: int


# ---------------- Basic Routes ----------------
@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}


@app.get("/about")
def about():
    return {"message": "This is a mentor-student platform"}


@app.get("/contact")
def contact():
    return {"email": "support@example.com"}


@app.get("/greet")
def greet(name: str):
    return {"message": f"Hello {name}"}


@app.get("/calculate")
def calculate(num1: int, num2: int):
    return {"sum": num1 + num2}


@app.get("/get-user-role")
def role(name: str, role: str):
    return {"message": f"{name} is a {role}"}


# ---------------- Create User ----------------
@app.post("/create-user")
def create_user(user: User, db: Session = Depends(get_db)):

    new_user = UserDB(
        name=user.name,
        email=user.email,
        role=user.role,
        age=user.age   # make sure this exists in models.py
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User saved in database ✅",
        "user_id": new_user.id
    }


# ---------------- Get All Users ----------------
@app.get("/get-users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(UserDB).all()

    return {
        "total_users": len(users),
        "data": users
    }