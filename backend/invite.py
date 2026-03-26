from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Invite
from auth import get_current_user

# 🔥 WebSocket
from websocket.manager import manager
import json

# ✅ KEEP ONLY ONE ROUTER
router = APIRouter(prefix="/invite", tags=["Invite"])


# 🚀 Send Invite (WITH REAL-TIME)
@router.post("/send")
async def send_invite(
    receiver_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    invite = Invite(
        sender_id=user.id,
        receiver_id=receiver_id
    )
    db.add(invite)
    db.commit()
    db.refresh(invite)

    # 🔥 REAL-TIME EVENT
    await manager.broadcast(
        str(receiver_id),
        json.dumps({
            "type": "invite",
            "sender_id": user.id,
            "invite_id": invite.id
        })
    )

    return invite


# 🔹 Get My Invites
@router.get("/my")
def get_my_invites(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Invite).filter(Invite.receiver_id == user.id).all()


# 🔹 Accept Invite
@router.post("/accept/{invite_id}")
def accept_invite(
    invite_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    invite = db.query(Invite).filter(Invite.id == invite_id).first()

    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")

    if invite.receiver_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    invite.status = "accepted"
    db.commit()

    return {"message": "Accepted"}


# 🔹 Reject Invite
@router.post("/reject/{invite_id}")
def reject_invite(
    invite_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    invite = db.query(Invite).filter(Invite.id == invite_id).first()

    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")

    if invite.receiver_id != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    invite.status = "rejected"
    db.commit()

    return {"message": "Rejected"}