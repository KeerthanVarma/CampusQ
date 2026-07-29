from fastapi import APIRouter
from app.api.v1 import auth, outlets, orders, ws

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(outlets.router)
api_router.include_router(orders.router)
api_router.include_router(ws.router)