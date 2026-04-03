from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from websocket.manager import manager
import json
from datetime import datetime

router = APIRouter()

session_code_store = {}
chat_store = {}

@router.websocket("/ws/session/{session_code}")
async def websocket_endpoint(websocket: WebSocket, session_code: str):

    # ✅ Normalize room
    session_code = session_code.lower()

    await manager.connect(session_code, websocket)
    print(f"Connected to session {session_code}")

    # ✅ Send existing code
    if session_code in session_code_store:
        await websocket.send_text(json.dumps({
            "type": "code_update",
            "code": session_code_store[session_code]
        }))

    # ✅ Send existing chat
    if session_code in chat_store:
        for msg in chat_store[session_code]:
            await websocket.send_text(json.dumps(msg))

    try:
        while True:
            data = await websocket.receive_text()

            try:
                parsed_data = json.loads(data)
            except:
                continue

            message_type = parsed_data.get("type")

            # 💬 CHAT
            if message_type == "chat":
                payload = {
                    "type": "chat",
                    "message": parsed_data.get("message"),
                    "sender": parsed_data.get("sender", "User"),
                    "time": datetime.utcnow().strftime("%H:%M")
                }

                chat_store.setdefault(session_code, []).append(payload)

                await manager.broadcast(session_code, payload)

            # 💻 CODE (🔥 FIXED HERE)
            elif message_type == "code_update":
                code = parsed_data.get("code")
                language = parsed_data.get("language")
                sender = parsed_data.get("sender", "User")  # ✅ FIX

                session_code_store[session_code] = code

                await manager.broadcast(session_code, {
                    "type": "code_update",
                    "code": code,
                    "language": language,
                    "sender": sender  # 🔥 IMPORTANT
                })

            # 👤 CURSOR
            elif message_type == "cursor":
                await manager.broadcast(session_code, {
                    "type": "cursor",
                    "lineNumber": parsed_data.get("lineNumber"),
                    "column": parsed_data.get("column"),
                    "user": parsed_data.get("user")
                })

            # 🎥 WEBRTC
            elif message_type in ["offer", "answer", "ice-candidate"]:
                await manager.broadcast(session_code, {
                    "type": message_type,
                    "data": parsed_data.get("data")
                })

            # 📞 CALL
            elif message_type == "call_request":
                await manager.broadcast(session_code, {
                    "type": "call_request",
                    "caller": parsed_data.get("caller", "User")
                })

            elif message_type == "call_accept":
                await manager.broadcast(session_code, {
                    "type": "call_accept"
                })

            elif message_type == "call_reject":
                await manager.broadcast(session_code, {
                    "type": "call_reject"
                })

            # 👤 JOIN
            elif message_type == "join":
                await manager.broadcast(session_code, {
                    "type": "system",
                    "message": f"{parsed_data.get('sender', 'User')} joined session"
                })

            # ❌ END SESSION
            elif message_type == "session_end":
                await manager.broadcast(session_code, {
                    "type": "session_end",
                    "message": "Session ended"
                })

                session_code_store.pop(session_code, None)
                chat_store.pop(session_code, None)

                break

    except WebSocketDisconnect:
        manager.disconnect(session_code, websocket)

        if session_code in manager.active_connections:
            if not manager.active_connections[session_code]:
                session_code_store.pop(session_code, None)
                chat_store.pop(session_code, None)