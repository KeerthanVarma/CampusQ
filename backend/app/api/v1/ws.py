from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import ws_manager

router = APIRouter(prefix="/ws", tags=["WebSockets"])

@router.websocket("/outlet/{outlet_id}")
async def outlet_websocket(websocket: WebSocket, outlet_id: int):
    """Kitchen Board and Staff Dashboard connection endpoint."""
    await ws_manager.connect_outlet(outlet_id, websocket)
    try:
        while True:
            # Keep connection alive with heartbeats
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect_outlet(outlet_id, websocket)

@router.websocket("/student/{user_id}")
async def student_websocket(websocket: WebSocket, user_id: int):
    """Student Live Order Tracker connection endpoint."""
    await ws_manager.connect_user(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect_user(user_id, websocket)