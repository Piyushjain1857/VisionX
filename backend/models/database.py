from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text, Date, DateTime, Numeric
from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from sqlalchemy.sql import func
from typing import List

class Base(DeclarativeBase):
    pass

class UserDB(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="Farmer")
    full_name: Mapped[str] = mapped_column(String(100), nullable=True)
    location: Mapped[str] = mapped_column(Text, nullable=True)
    state: Mapped[str] = mapped_column(String(100), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    mobile: Mapped[str] = mapped_column(String(20), nullable=True)
    photo_url: Mapped[str] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    lands: Mapped[List["LandDB"]] = relationship("LandDB", back_populates="farmer")
    crops: Mapped[List["CropDB"]] = relationship("CropDB", back_populates="farmer")
    history: Mapped[List["HistoryDB"]] = relationship("HistoryDB", back_populates="farmer")
    discussions: Mapped[List["DiscussionDB"]] = relationship("DiscussionDB", back_populates="farmer")
    notifications: Mapped[List["NotificationDB"]] = relationship("NotificationDB", back_populates="farmer")

class LandDB(Base):
    __tablename__ = "land"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    farmer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    land_name: Mapped[str] = mapped_column(String(100), nullable=True)
    area_size: Mapped[float] = mapped_column(Numeric(10, 2))
    location: Mapped[str] = mapped_column(Text, nullable=True)
    state: Mapped[str] = mapped_column(String(100), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    farmer: Mapped["UserDB"] = relationship("UserDB", back_populates="lands")
    fields: Mapped[List["FieldDB"]] = relationship("FieldDB", back_populates="land")
    crops: Mapped[List["CropDB"]] = relationship("CropDB", back_populates="land")
    history: Mapped[List["HistoryDB"]] = relationship("HistoryDB", back_populates="land")

class FieldDB(Base):
    __tablename__ = "fields"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    land_id: Mapped[int] = mapped_column(Integer, ForeignKey("land.id"))
    name: Mapped[str] = mapped_column(String(100))
    area: Mapped[float] = mapped_column(Numeric(10, 2))
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    land: Mapped["LandDB"] = relationship("LandDB", back_populates="fields")

class CropDB(Base):
    __tablename__ = "crops"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    farmer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    land_id: Mapped[int] = mapped_column(Integer, ForeignKey("land.id"))
    crop_name: Mapped[str] = mapped_column(String(100))
    variety: Mapped[str] = mapped_column(String(100), nullable=True)
    planted_date: Mapped[Date] = mapped_column(Date)
    estimated_harvest_date: Mapped[Date] = mapped_column(Date, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    farmer: Mapped["UserDB"] = relationship("UserDB", back_populates="crops")
    land: Mapped["LandDB"] = relationship("LandDB", back_populates="crops")

class HistoryDB(Base):
    __tablename__ = "history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    farmer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    land_id: Mapped[int] = mapped_column(Integer, ForeignKey("land.id"))
    crop: Mapped[str] = mapped_column(String(100))
    year: Mapped[int] = mapped_column(Integer)
    yield_amount: Mapped[float] = mapped_column(Numeric(10, 2))
    disease_record: Mapped[str] = mapped_column(Text, nullable=True)
    treatment_record: Mapped[str] = mapped_column(Text, nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    farmer: Mapped["UserDB"] = relationship("UserDB", back_populates="history")
    land: Mapped["LandDB"] = relationship("LandDB", back_populates="history")

class DiscussionDB(Base):
    __tablename__ = "discussions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    farmer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    heading: Mapped[str] = mapped_column(String(255))
    question: Mapped[str] = mapped_column(Text)
    answer: Mapped[str] = mapped_column(Text) 
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    farmer: Mapped["UserDB"] = relationship("UserDB", back_populates="discussions")

class NotificationDB(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    farmer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String(50)) # 'Weather', 'Disease', 'General'
    state: Mapped[str] = mapped_column(String(100), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    crop: Mapped[str] = mapped_column(String(100), nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    farmer: Mapped["UserDB"] = relationship("UserDB", back_populates="notifications")

