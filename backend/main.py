from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

from database import engine, SessionLocal
from models import Base, UserDB

# Routers
from websocket.routes import router as websocket_router
from routes.session import router as session_router   # ✅ NEW

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DB Dependency ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- Password ----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

# ---------------- JWT ----------------
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()

    now = datetime.utcnow()
    expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": expire,
        "iat": now
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- Get Current User ----------------
def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user = db.query(UserDB).filter(UserDB.id == payload["user_id"]).first()

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------------- SCHEMAS ----------------
from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str
    age: int

class LoginData(BaseModel):
    email: str
    password: str

# ---------------- ROUTES ----------------

@app.get("/")
def home():
    return {"message": "Backend is running"}

# ---------------- REGISTER ----------------
@app.post("/register")
def register(user: User, db: Session = Depends(get_db)):
    existing = db.query(UserDB).filter(UserDB.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = UserDB(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        age=user.age
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}

# ---------------- LOGIN ----------------
@app.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # ✅ FIX: include name in token
    token = create_access_token({
        "user_id": user.id,
        "role": user.role,
        "name": user.name   # 🔥 IMPORTANT FIX
    })

    return {
        "access_token": token,
        "user_id": user.id,
        "role": user.role
    }
# ---------------- INCLUDE ROUTERS ----------------
app.include_router(websocket_router)
app.include_router(session_router)  