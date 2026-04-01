from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from datetime import datetime
import uuid

from database import get_db
from models import Session as SessionModel, UserDB
from schemas import SessionResponse, SessionJoin, SessionEnd

router = APIRouter(prefix="/session", tags=["Session"])


# =========================
# HELPER: GET CURRENT USER
# =========================
# (Assumes JWT already decoded in frontend and user_id passed)
def get_current_user(user_id: int, db: DBSession):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# =========================
#  CREATE SESSION
# =========================
@router.post("/create", response_model=SessionResponse)
def create_session(user_id: int, db: DBSession = Depends(get_db)):
    user = get_current_user(user_id, db)

    # 🔗 Generate unique session code
    session_code = str(uuid.uuid4())[:8]

    new_session = SessionModel(
        session_code=session_code,
        created_by=user.id,
        status="active",
        start_time=datetime.utcnow()
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session


# =========================
#  JOIN SESSION
# =========================
@router.post("/join")
def join_session(data: SessionJoin, db: DBSession = Depends(get_db)):
    session = db.query(SessionModel).filter(
        SessionModel.session_code == data.session_code
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.status == "ended":
        raise HTTPException(status_code=400, detail="Session already ended")

    return {
        "message": "Joined successfully",
        "session_code": session.session_code
    }


# =========================
#  END SESSION
# =========================
@router.post("/end")
def end_session(data: SessionEnd, user_id: int, db: DBSession = Depends(get_db)):
    session = db.query(SessionModel).filter(
        SessionModel.session_code == data.session_code
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 🔐 Only creator can end session
    if session.created_by != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if session.status == "ended":
        raise HTTPException(status_code=400, detail="Session already ended")

    session.status = "ended"
    session.end_time = datetime.utcnow()

    db.commit()

    return {"message": "Session ended successfully"}


# =========================
#  GET SESSION DETAILS
# =========================
@router.get("/{session_code}", response_model=SessionResponse)
def get_session(session_code: str, db: DBSession = Depends(get_db)):
    session = db.query(SessionModel).filter(
        SessionModel.session_code == session_code
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return session