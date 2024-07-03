from pydantic import BaseModel, AnyUrl, EmailStr, Field, field_validator
from pydantic_extra_types.phone_numbers import PhoneNumber
from datetime import date
from typing import Literal
import re


# Regex pattern

pattern_name = r'^[a-zA-Z0-9]{3,30}$'
pattern_password = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$'


class UserSignUPInput(BaseModel):
    name: str = Field(..., min_length=3, max_length=30,
                      pattern=pattern_name)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=20,)

    @field_validator('password')
    def password_pattern(cls, v):
        if re.match(pattern_password, v) is None:
            raise ValueError(
                'password should contain at least 1 uppercase, 1 lowercase and 1 number.')
        return v


class UserSignInInput(BaseModel):
    email: EmailStr = Field(..., max_length=50)
    password: str = Field(..., min_length=8, max_length=20,)

    @field_validator('password')
    def password_pattern(cls, v):
        if re.match(pattern_password, v) is None:
            raise ValueError(
                'password should contain at least 1 uppercase, 1 lowercase and 1 number.')
        return v


class User(BaseModel):
    id: int
    name: str = Field(..., min_length=3, max_length=30,
                      pattern=pattern_name)
    email: EmailStr


class ReturnUser(BaseModel):
    data: User | None


class BookingInput(BaseModel):
    attractionId: int
    date: date
    time: Literal['Morning', 'Afternoon']
    price: Literal[2000, 2500]


class Success(BaseModel):
    ok: bool


class Error(BaseModel):
    error: bool
    message: str


class BookingAttraction(BaseModel):
    id: int
    name: str
    address: str
    image: AnyUrl


class Booking(BaseModel):
    attraction: BookingAttraction
    date: date
    time: Literal['Morning', 'Afternoon']
    price: Literal[2000, 2500]


class GetBookingSuccess(BaseModel):
    data: Booking | None


class Trip(BaseModel):
    attraction: BookingAttraction
    date: date
    time: Literal['Morning', 'Afternoon']


class Contact(BaseModel):
    name: str
    email: EmailStr
    phone: str

class OrderInput(BaseModel):
    price: Literal[2000, 2500]
    trip: Trip
    contact: Contact

class PostOrder(BaseModel):
    prime: str
    order: OrderInput

class PaymentStatus(BaseModel):
    status: int
    message: str

class OrderResult(BaseModel):
    number: str
    payment: PaymentStatus

class PostOrderSuccess(BaseModel):
    data: OrderResult

class Order(BaseModel):
    number: str
    price: Literal[2000, 2500]
    trip: Trip
    contact: Contact
    status: Literal[1 ,0]

class OrderResponse(BaseModel):
    data: Order | None
