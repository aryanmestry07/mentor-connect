from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # 🔥 NOW USING STRING session_code
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

            # 🔥 Remove empty room
            if not self.active_connections[room]:
                del self.active_connections[room]

        print(f"❌ Disconnected from room {room}")
        print("📊 ACTIVE ROOMS:", {
            k: len(v) for k, v in self.active_connections.items()
        })

    # 📡 BROADCAST
    async def broadcast(self, room: str, message: str):
        if room not in self.active_connections:
            print(f"⚠️ No active connections in room {room}")
            return

        print(f"📡 Broadcasting to room {room} ({len(self.active_connections[room])} users)")

        dead_connections = []

        for connection in self.active_connections[room]:
            try:
                await connection.send_text(message)
            except Exception:
                dead_connections.append(connection)

        # 🔥 CLEAN DEAD CONNECTIONS
        for conn in dead_connections:
            self.disconnect(room, conn)

    # 🔴 CLOSE ENTIRE ROOM (NEW 🔥)
    async def close_room(self, room: str):
        if room not in self.active_connections:
            return

        print(f"🛑 Closing room {room}")

        for connection in self.active_connections[room]:
            try:
                await connection.close()
            except Exception:
                pass

        # 🔥 REMOVE ROOM COMPLETELY
        del self.active_connections[room]

        print(f"✅ Room {room} closed successfully")


manager = ConnectionManager()