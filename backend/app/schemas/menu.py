from pydantic import BaseModel
from typing import Optional

class MenuItemBase(BaseModel):
    name: str
    price: float
    image_url: Optional[str] = None
    is_available: bool = True

class MenuItemCreate(MenuItemBase):
    outlet_id: int

class MenuItemUpdateAvailability(BaseModel):
    is_available: bool

class MenuItemResponse(MenuItemBase):
    id: int
    outlet_id: int

    class Config:
        from_attributes = True