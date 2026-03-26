from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from websocket.manager import manager
import json

router = APIRouter()

@router.websocket("/ws/session/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):

    # ✅ CORRECT ORDER
    await manager.connect(session_id, websocket)

    print(f"✅ Connected to session {session_id}")

    try:
        while True:
            data = await websocket.receive_text()
            parsed_data = json.loads(data)

            message_type = parsed_data.get("type")

            # 🔹 CHAT
            if message_type == "chat":
                await manager.broadcast(session_id, json.dumps({
                    "type": "chat",
                    "message": parsed_data.get("message")
                }))

            # 🔹 CODE EDITOR
            elif message_type == "editor":
                await manager.broadcast(session_id, json.dumps({
                    "type": "editor",
                    "code": parsed_data.get("code")
                }))

            # 🔹 VIDEO CALL SIGNALING
            elif message_type in ["offer", "answer", "ice"]:
                await manager.broadcast(session_id, json.dumps(parsed_data))

    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)
        print(f"❌ Disconnected from session {session_id}")