from fastapi import APIRouter, Request, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field, field_validator
import re
import datetime
import jwt
from .function import *
from dotenv import load_dotenv
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
load_dotenv()
JWTkey = os.getenv('JWTkey')

router = APIRouter(
    prefix="/api/user",
    tags=["user"]
)

# User registration

## Regex pattern

pattern_name = r'^[a-zA-Z0-9]{3,30}$'
pattern_password = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$'

## Class

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

## path


@router.post("", response_class=JSONResponse)
async def sign_up(request: Request, user: UserSignUPInput):
    # Check if duplicated
    name, email, password = (s.strip()
                             for s in (user.name, user.email, user.password))
    sql = 'SELECT email FROM member\
            WHERE email = %s'
    val = (email,)
    myresult = await fetchJSON(sql, val, False)

    # Cond1: No exist email.
    if len(myresult) == 0:
        print("Email not exist.")
        response = {
            "ok": True
        }
        sql = 'INSERT INTO member\
                (name, email, password)\
                VALUES (%s, %s, %s)'
        val = (name, email, password,)
        commitDB(sql, val)
        return JSONResponse(
            status_code=200,
            content=response
        )
    # Cond2: Email exist
    elif len(myresult) != 0:
        print("Email is already existed")
        response = {
            "error": True,
            "message": "電子郵件已被註冊"
        }
        return JSONResponse(
            status_code=400,
            content=response
        )


@router.put("/auth", response_class=JSONResponse)
async def sign_in(request: Request, user: UserSignInInput):
    # Check if the email and password match
    email, password = (s.strip() for s in (user.email, user.password))
    sql = 'SELECT * FROM member\
            WHERE email = %s\
            AND password = %s'
    val = (email, password,)
    myresult = await fetchJSON(sql, val, False)
    # Cond1: user not exist
    if (len(myresult) == 0):
        print("User not exist.")
        # Construct response
        response = {
            "error": True,
            "message": "帳號或密碼錯誤"
        }
        return JSONResponse(
            status_code=400,
            content=response
        )
    # Cond2: user exist
    else:
        print("User exist.")
        for user_critical in myresult:
            # Construct jwt info
            response = {
                "id": user_critical[0],
                "name": user_critical[1],
                "email": user_critical[2],
                "exp": datetime.datetime.now() + datetime.timedelta(days=7)
            }
            # Encode info
            encoded_response = jwt.encode(
                response, str(JWTkey), algorithm="HS256")
            # Construct response
            response = {
                "token": encoded_response
            }
            return JSONResponse(
                status_code=200,
                content=response
            )


@router.get("/auth", response_model=ReturnUser)
async def user_validation(request: Request, Authorization: str = Header(None)):

    try:
        if Authorization is None:
            response = {
                "data": None
            }
        else:
            user_data = jwt.decode(Authorization, str(JWTkey), algorithms="HS256")

            response = {
                "data": {
                    "id": user_data['id'],
                    "name": user_data['name'],
                    "email": user_data['email']
                }
            }

    # If token expired or decoded wrong
    except (jwt.ExpiredSignatureError, jwt.DecodeError, Exception, jwt.InvalidTokenError):
        response = {
            "data": None
        }
    finally:
        return JSONResponse(
            status_code=200,
            content=response
        )
