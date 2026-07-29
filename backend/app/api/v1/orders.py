from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.db.models import Order, OrderItem, MenuItem, Outlet, OrderStatus
from app.schemas.order import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=OrderResponse)
def place_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    # 1. Verify Outlet status
    outlet = db.query(Outlet).filter(Outlet.id == order_data.outlet_id).first()
    if not outlet:
        raise HTTPException(status_code=404, detail="Outlet not found")
    
    if not outlet.is_open:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This outlet is currently CLOSED and cannot accept orders."
        )

    if not order_data.items:
        raise HTTPException(status_code=400, detail="Cart cannot be empty.")

    # 2. Compute total and validate item availability
    total_amount = 0.0
    order_items_to_create = []

    for item_req in order_data.items:
        menu_item = db.query(MenuItem).filter(
            MenuItem.id == item_req.item_id,
            MenuItem.outlet_id == order_data.outlet_id
        ).first()

        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item {item_req.item_id} not found at this outlet.")
        
        if not menu_item.is_available:
            raise HTTPException(
                status_code=400, 
                detail=f"'{menu_item.name}' is currently OUT OF STOCK."
            )

        item_total = menu_item.price * item_req.quantity
        total_amount += item_total

        order_items_to_create.append(
            OrderItem(
                item_id=menu_item.id,
                quantity=item_req.quantity,
                locked_price=menu_item.price
            )
        )

    # 3. Create the order (For initial testing, fallback user_id=1 until Auth JWT route is connected)
    new_order = Order(
        user_id=1, 
        outlet_id=order_data.outlet_id,
        status=OrderStatus.PLACED,
        total_amount=total_amount,
        items=order_items_to_create
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order


from pydantic import BaseModel
from app.db.models import OrderStatus
from app.services.websocket_manager import ws_manager
from app.deps import get_current_staff, User

class StatusUpdatePayload(BaseModel):
    status: OrderStatus

@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int, 
    payload: StatusUpdatePayload, 
    db: Session = Depends(get_db),
    staff_user: User = Depends(get_current_staff)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = payload.status
    db.commit()
    db.refresh(order)

    # Trigger Real-Time WebSocket Alerts
    event_data = {
        "type": "ORDER_STATUS_CHANGED",
        "order_id": order.id,
        "status": order.status.value,
        "outlet_id": order.outlet_id,
        "user_id": order.user_id,
        "updated_at": str(order.updated_at)
    }

    # Broadcast to Outlet Staff Dashboard & Kitchen Display
    await ws_manager.broadcast_to_outlet(order.outlet_id, event_data)
    
    # Notify Student directly
    await ws_manager.notify_user(order.user_id, event_data)

    return order