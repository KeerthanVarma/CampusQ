from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.db.models import Outlet, MenuItem
from app.schemas.outlet import OutletResponse, OutletStatusUpdate
from app.schemas.menu import MenuItemResponse

router = APIRouter(prefix="/outlets", tags=["Outlets"])

@router.get("/", response_model=List[OutletResponse])
def get_all_outlets(db: Session = Depends(get_db)):
    """Fetch all outlets with their Open/Closed status."""
    return db.query(Outlet).all()

@router.get("/{outlet_id}/menu", response_model=List[MenuItemResponse])
def get_outlet_menu(outlet_id: int, db: Session = Depends(get_db)):
    """Fetch menu for a specific outlet. Prevents viewing if closed."""
    outlet = db.query(Outlet).filter(Outlet.id == outlet_id).first()
    if not outlet:
        raise HTTPException(status_code=404, detail="Outlet not found")
    
    if not outlet.is_open:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Outlet is currently CLOSED. Orders and menus are locked."
        )
    
    return db.query(MenuItem).filter(MenuItem.outlet_id == outlet_id).all()

@router.patch("/{outlet_id}/status", response_model=OutletResponse)
def toggle_outlet_status(outlet_id: int, status_update: OutletStatusUpdate, db: Session = Depends(get_db)):
    """Staff/Admin toggle to OPEN or CLOSE an outlet."""
    outlet = db.query(Outlet).filter(Outlet.id == outlet_id).first()
    if not outlet:
        raise HTTPException(status_code=404, detail="Outlet not found")
    
    outlet.is_open = status_update.is_open
    db.commit()
    db.refresh(outlet)
    return outlet