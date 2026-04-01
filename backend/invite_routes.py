from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Invite, Session as SessionModel, UserDB
from auth import get_current_user
from websocket.manager import manager
import json

router = APIRouter(prefix="/invite", tags=["Invite"])


# 🚀 SEND INVITE
@router.post("/send")
async def send_invite(
    receiver_id: int,
    db: Session = Depends(get_db),
    user: UserDB = Depends(get_current_user)
):
    # 🔥 VALIDATION
    if user.id == receiver_id:
        raise HTTPException(status_code=400, detail="Cannot invite yourself")

    receiver = db.query(UserDB).filter(UserDB.id == receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    # 🔥 CREATE SESSION FIRST
    session = SessionModel(
        mentor_id=user.id,
        student_id=receiver_id,
        status="pending"
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # 🔥 CREATE INVITE WITH SESSION ID
    invite = Invite(
        sender_id=user.id,
        receiver_id=receiver_id,
        session_id=session.id
    )
    db.add(invite)
    db.commit()
    db.refresh(invite)

    print("🔥 SESSION CREATED:", session.id)

    # 🔥 REAL-TIME NOTIFY RECEIVER
    await manager.broadcast(
        str(receiver_id),
        json.dumps({
            "type": "invite",
            "sender_id": user.id,
            "invite_id": invite.id,
            "session_id": session.id
        })
    )

    return {
        "message": "Invite sent",
        "session_id": session.id
    }


# 🔹 GET MY INVITES
@router.get("/my")
def get_my_invites(
    db: Session = Depends(get_db),
    user: UserDB = Depends(get_current_user)
):
    print("🔥 INVITE API HIT")  # debug

    invites = db.query(Invite).filter(
        Invite.receiver_id == user.id
    ).all()

    return invites


# 🔥 ACCEPT INVITE
@router.post("/accept/{invite_id}")
async def accept_invite(
    invite_id: int,
    db: Session = Depends(get_db),
    user: UserDB = Depends(get_current_user)
):
    invite = db.query(Invite).filter(Invite.id == invite_id).first()

    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")

    if invite.receiver_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    # ✅ UPDATE STATUS
    invite.status = "accepted"
    db.commit()

    # 🔥 USE SAME SESSION
    session_id = invite.session_id

    print("🔥 USING SESSION:", session_id)

    # 🔥 ACTIVATE SESSION
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if session:
        session.status = "active"
        db.commit()

    # 🔥 NOTIFY BOTH USERS
    await manager.broadcast(
        str(invite.sender_id),
        json.dumps({
            "type": "session_started",
            "session_id": session_id
        })
    )

    await manager.broadcast(
        str(invite.receiver_id),
        json.dumps({
            "type": "session_started",
            "session_id": session_id
        })
    )

    return {
        "message": "Accepted",
        "session_id": session_id
    }


# 🔹 REJECT INVITE
@router.post("/reject/{invite_id}")
def reject_invite(
    invite_id: int,
    db: Session = Depends(get_db),
    user: UserDB = Depends(get_current_user)
):
    invite = db.query(Invite).filter(Invite.id == invite_id).first()

    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")

    if invite.receiver_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    invite.status = "rejected"
    db.commit()

    return {"message": "Rejected"}