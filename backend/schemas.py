from pydantic import BaseModel

class InviteCreate(BaseModel):
    receiver_id: int

class InviteResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    status: str

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    username: str
    password: str
    role: str  # student / mentor