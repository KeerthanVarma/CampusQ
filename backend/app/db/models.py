from datetime import datetime
from enum import Enum as PyEnum
from typing import List, Optional
from sqlalchemy import String, Float, Boolean, ForeignKey, DateTime, Enum, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func

class Base(DeclarativeBase):
    pass

class UserRole(PyEnum):
    STUDENT = "student"
    STAFF = "staff"
    ADMIN = "admin"

class OrderStatus(PyEnum):
    PLACED = "placed"
    ACCEPTED = "accepted"
    PREPARING = "preparing"
    READY = "ready"
    COLLECTED = "collected"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.STUDENT)
    roll_number: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    orders: Mapped[List["Order"]] = relationship(back_populates="user")

class Outlet(Base):
    __tablename__ = "outlets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_open: Mapped[bool] = mapped_column(Boolean, default=True)  # Master toggle
    estimated_wait_time: Mapped[int] = mapped_column(Integer, default=15) # minutes

    menu_items: Mapped[List["MenuItem"]] = relationship(back_populates="outlet")
    orders: Mapped[List["Order"]] = relationship(back_populates="outlet")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    outlet_id: Mapped[int] = mapped_column(ForeignKey("outlets.id"), index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    price: Mapped[float] = mapped_column(Float)
    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True) # Out of stock toggle

    outlet: Mapped["Outlet"] = relationship(back_populates="menu_items")

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    outlet_id: Mapped[int] = mapped_column(ForeignKey("outlets.id"), index=True)
    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), default=OrderStatus.PLACED, index=True)
    total_amount: Mapped[float] = mapped_column(Float)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship(back_populates="orders")
    outlet: Mapped["Outlet"] = relationship(back_populates="orders")
    items: Mapped[List["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), index=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("menu_items.id"))
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    locked_price: Mapped[float] = mapped_column(Float)

    order: Mapped["Order"] = relationship(back_populates="items")
    item: Mapped["MenuItem"] = relationship()