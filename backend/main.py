from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Header, HTTPException
from models import Session as SessionModel
from datetime import datetime
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
    password: str
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



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# register api
@app.post("/register")
def register(user: User, db: Session = Depends(get_db)):

    hashed_password = hash_password(user.password)

    new_user = UserDB(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role,
        age=user.age
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


# Login API

@app.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):

    user = db.query(UserDB).filter(UserDB.email == email).first()

    if not user:
        return {"error": "User not found"}

    if not verify_password(password, user.password):
        return {"error": "Invalid password"}

    token = create_access_token({"user_id": user.id})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Header(...)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    

@app.get("/protected")
def protected(user=Depends(get_current_user)):
    return {"message": "You are authorized", "user": user}



@app.post("/sessions/create")
def create_session(
    mentor_id: int,
    student_id: int,
    db: Session = Depends(get_db)
):

    session = SessionModel(
        mentor_id=mentor_id,
        student_id=student_id,
        status="pending"
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "message": "Session created",
        "session_id": session.id
    }

@app.post("/sessions/join")
def join_session(session_id: int, db: Session = Depends(get_db)):

    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()

    if not session:
        return {"error": "Session not found"}

    session.status = "active"
    session.start_time = datetime.utcnow()

    db.commit()

    return {"message": "Session started"}

@app.post("/sessions/end")
def end_session(session_id: int, db: Session = Depends(get_db)):

    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()

    if not session:
        return {"error": "Session not found"}

    session.status = "completed"
    session.end_time = datetime.utcnow()

    db.commit()

    return {"message": "Session ended"}

@app.get("/sessions/{session_id}")
def get_session(session_id: int, db: Session = Depends(get_db)):

    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()

    if not session:
        return {"error": "Session not found"}

    return session