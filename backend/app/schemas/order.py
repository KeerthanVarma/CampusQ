from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.db.models import OrderStatus
from app.schemas.menu import MenuItemResponse

class OrderItemCreate(BaseModel):
    item_id: int
    quantity: int

class OrderCreate(BaseModel):
    outlet_id: int
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    item_id: int
    quantity: int
    locked_price: float
    item: MenuItemResponse

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    outlet_id: int
    status: OrderStatus
    total_amount: float
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True