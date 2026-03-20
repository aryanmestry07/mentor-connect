# websocket/manager.py

from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections = {}  # session_id: [connections]

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)

    def disconnect(self, session_id: str, websocket: WebSocket):
        self.active_connections[session_id].remove(websocket)

    async def broadcast(self, session_id: str, message: str):
        for connection in self.active_connections.get(session_id, []):
            await connection.send_text(message)


manager = ConnectionManager()