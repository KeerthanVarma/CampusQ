from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from app.db.models import UserRole

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    roll_number: Optional[str] = None
    role: UserRole = UserRole.STUDENT

    @field_validator('email')
    @classmethod
    def validate_iitgn_email(cls, v: str) -> str:
        domain = v.split('@')[-1].lower()
        # For local dev testing, allow staff/admin emails, but enforce domain check
        if not (domain == "iitgn.ac.in" or domain.endswith(".iitgn.ac.in")):
            raise ValueError("Only official IITGN email addresses (@iitgn.ac.in) are permitted.")
        return v.lower()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: UserRole
    roll_number: Optional[str] = None

    class Config:
        from_attributes = True