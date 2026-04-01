from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from websocket.manager import manager
import json
from datetime import datetime

router = APIRouter()

# STORE LATEST CODE PER SESSION
session_code_store = {}


@router.websocket("/ws/session/{session_code}")
async def websocket_endpoint(websocket: WebSocket, session_code: str):

    await manager.connect(session_code, websocket)
    print(f"Connected to session {session_code}")

    # Send existing code
    if session_code in session_code_store:
        await websocket.send_text(json.dumps({
            "type": "editor",
            "code": session_code_store[session_code]
        }))

    try:
        while True:
            data = await websocket.receive_text()

            try:
                parsed_data = json.loads(data)
            except:
                continue

            message_type = parsed_data.get("type")

            # CHAT
            if message_type == "chat":
                message = parsed_data.get("message")
                sender = parsed_data.get("sender", "User")

                payload = {
                    "type": "chat",
                    "message": message,
                    "sender": sender,
                    "time": datetime.utcnow().strftime("%H:%M")
                }

                await manager.broadcast(session_code, json.dumps(payload))

            # CODE EDITOR
            elif message_type == "editor":
                code = parsed_data.get("code")

                session_code_store[session_code] = code

                await manager.broadcast(session_code, json.dumps({
                    "type": "editor",
                    "code": code,
                }))

            # VIDEO SIGNALING
            elif message_type in ["offer", "answer", "ice"]:
                await manager.broadcast(session_code, json.dumps({
                    "type": message_type,
                    "data": parsed_data.get("data")
                }))

            # USER JOIN
            elif message_type == "join":
                await manager.broadcast(session_code, json.dumps({
                    "type": "system",
                    "message": "User joined session"
                }))

            # SESSION END
            elif message_type == "session_end":
                await manager.broadcast(session_code, json.dumps({
                    "type": "session_end",
                    "message": "Session ended by host"
                }))

                await manager.close_room(session_code)
                session_code_store.pop(session_code, None)

                print(f"Session {session_code} ended")
                break

    except WebSocketDisconnect:
        manager.disconnect(session_code, websocket)
        print(f"Disconnected from session {session_code}")

        # Cleanup if empty
        if session_code in manager.active_connections:
            if not manager.active_connections[session_code]:
                session_code_store.pop(session_code, None)