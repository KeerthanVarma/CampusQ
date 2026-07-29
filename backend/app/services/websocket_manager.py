from typing import Dict, List
from fastapi import WebSocket
import json

class ConnectionManager:
    def __init__(self):
        # outlet_id -> List of active staff/display WebSockets
        self.outlet_sockets: Dict[int, List[WebSocket]] = {}
        # user_id -> List of active student WebSockets
        self.user_sockets: Dict[int, List[WebSocket]] = {}

    async def connect_outlet(self, outlet_id: int, websocket: WebSocket):
        await websocket.accept()
        if outlet_id not in self.outlet_sockets:
            self.outlet_sockets[outlet_id] = []
        self.outlet_sockets[outlet_id].append(websocket)

    async def connect_user(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.user_sockets:
            self.user_sockets[user_id] = []
        self.user_sockets[user_id].append(websocket)

    def disconnect_outlet(self, outlet_id: int, websocket: WebSocket):
        if outlet_id in self.outlet_sockets:
            self.outlet_sockets[outlet_id].remove(websocket)

    def disconnect_user(self, user_id: int, websocket: WebSocket):
        if user_id in self.user_sockets:
            self.user_sockets[user_id].remove(websocket)

    async def broadcast_to_outlet(self, outlet_id: int, message: dict):
        """Pushes new order or state changes to Kitchen Board and Staff Dashboard."""
        if outlet_id in self.outlet_sockets:
            dead_sockets = []
            for ws in self.outlet_sockets[outlet_id]:
                try:
                    await ws.send_text(json.dumps(message))
                except Exception:
                    dead_sockets.append(ws)
            for ws in dead_sockets:
                self.outlet_sockets[outlet_id].remove(ws)

    async def notify_user(self, user_id: int, message: dict):
        """Notifies student about status change (ACCEPTED -> PREPARING -> READY)."""
        if user_id in self.user_sockets:
            dead_sockets = []
            for ws in self.user_sockets[user_id]:
                try:
                    await ws.send_text(json.dumps(message))
                except Exception:
                    dead_sockets.append(ws)
            for ws in dead_sockets:
                self.user_sockets[user_id].remove(ws)

ws_manager = ConnectionManager()