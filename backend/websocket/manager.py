from fastapi import WebSocket
import json


class ConnectionManager:
    def __init__(self):
        # room_id -> list of websockets
        self.active_connections: dict[str, list[WebSocket]] = {}

    # 🔗 CONNECT
    async def connect(self, room: str, websocket: WebSocket):
        await websocket.accept()

        if room not in self.active_connections:
            self.active_connections[room] = []

        self.active_connections[room].append(websocket)

        print(f"✅ Connected to room {room}")
        print("📊 ACTIVE ROOMS:", {
            k: len(v) for k, v in self.active_connections.items()
        })

    # ❌ DISCONNECT
    def disconnect(self, room: str, websocket: WebSocket):
        if room in self.active_connections:
            if websocket in self.active_connections[room]:
                self.active_connections[room].remove(websocket)

            # Clean empty rooms
            if not self.active_connections[room]:
                del self.active_connections[room]

        print(f"❌ Disconnected from room {room}")

    # 📡 BROADCAST (SAFE JSON VERSION)
    async def broadcast(self, room: str, message):
        if room not in self.active_connections:
            return

        # ✅ Convert dict → JSON string (IMPORTANT FIX)
        if isinstance(message, dict):
            message = json.dumps(message)

        print(f"📡 Broadcasting to {len(self.active_connections[room])} users")

        dead_connections = []

        for connection in list(self.active_connections[room]):
            try:
                await connection.send_text(message)
            except Exception:
                dead_connections.append(connection)

        # 🔥 CLEAN DEAD CONNECTIONS
        for conn in dead_connections:
            self.disconnect(room, conn)


# ✅ SINGLETON INSTANCE
manager = ConnectionManager()