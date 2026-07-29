from pydantic import BaseModel
from typing import Optional, List

class OutletBase(BaseModel):
    name: str
    image_url: Optional[str] = None
    is_open: bool = True
    estimated_wait_time: int = 15

class OutletCreate(OutletBase):
    pass

class OutletStatusUpdate(BaseModel):
    is_open: bool

class OutletResponse(OutletBase):
    id: int

    class Config:
        from_attributes = True