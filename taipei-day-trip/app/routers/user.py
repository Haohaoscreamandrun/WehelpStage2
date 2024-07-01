from fastapi import APIRouter, Request, Header
from fastapi.responses import JSONResponse
import datetime
import jwt
from starlette import status
from app.function.function import *
from app.function.basemodel import *
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

@router.post("", response_class=JSONResponse, summary="註冊一個新的會員")
async def sign_up(user: UserSignUPInput):
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


@router.put("/auth", response_class=JSONResponse, summary="登入會員帳戶")
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
        try:
            expiration = datetime.datetime.now() + datetime.timedelta(days=7)
            print("User exist.")
            for user_critical in myresult:
                # Construct jwt info
                response = {
                    "id": user_critical[0],
                    "name": user_critical[1],
                    "email": user_critical[2],
                    "exp": expiration
                }
                # Encode info
                encoded_response = jwt.encode(
                    response, JWTkey, algorithm="HS256")
                # Construct response
                response = {
                    "token": encoded_response
                }
                return JSONResponse(
                    status_code=200,
                    content=response
                )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token encoded error: " + str(e)
            )


@router.get("/auth", response_model=ReturnUser, summary="取得當前登入的會員資訊")
async def user_validation(request: Request, Authorization: str = Header(None)):

    try:
        if Authorization is None:
            response = {
                "data": None
            }
        else:
            Authorization = Authorization.split(" ")[1]
            user_data = jwt.decode(Authorization, JWTkey, algorithms="HS256")

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
