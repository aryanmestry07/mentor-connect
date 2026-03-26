from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections = {}

    # ✅ CORRECT ORDER (room, websocket)
    async def connect(self, room: str, websocket: WebSocket):
        await websocket.accept()

        if room not in self.active_connections:
            self.active_connections[room] = []

        self.active_connections[room].append(websocket)

        print(f"✅ Connected to room {room}")

    def disconnect(self, room: str, websocket: WebSocket):
        if room in self.active_connections:
            if websocket in self.active_connections[room]:
                self.active_connections[room].remove(websocket)

        print(f"❌ Disconnected from room {room}")

    async def broadcast(self, room: str, message: str):
        if room in self.active_connections:
            for connection in self.active_connections[room]:
                await connection.send_text(message)

manager = ConnectionManager()