# The line sys.stdout.reconfigure(encoding='utf-8') attempts to reconfigure the standard output stream(sys.stdout) to use UTF-8 encoding
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi import *
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from jwt.exceptions import InvalidTokenError
from dotenv import load_dotenv
import os
from mysql.connector import Error, pooling
from pydantic import BaseModel, EmailStr, ValidationError, Field, field_validator
import re
import jwt
import datetime
import sys
sys.stdout.reconfigure(encoding='utf-8')

# connection to mysql
load_dotenv()
DBpassword = os.getenv('DBpassword')
JWTkey = os.getenv('JWTkey')

# mydb = mysql.connector.connect(
#     host="localhost",
#     user="jimmy",
#     password=DBpassword,
#     database="attractions"
# )
# can return dict list


# connection pool
dbconfig = {
    'host': "localhost",
    'user': "jimmy",
    'password': DBpassword,
    'database': "attractions"
}
cnxpool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    # Reset session variables when the connection is returned to the pool.
    pool_reset_session=True,
    **dbconfig
)

# Server

app = FastAPI()
app.mount("/style", StaticFiles(directory="style"), name="style")
app.mount("/source", StaticFiles(directory='source'), name='source')
app.mount("/function", StaticFiles(directory="function"), name='function')
# Static Pages (Never Modify Code in this Block)


@app.get("/", include_in_schema=False)
async def index(request: Request):
    return FileResponse("./static/index.html", media_type="text/html")


@app.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
    return FileResponse("./static/attraction.html", media_type="text/html")


@app.get("/booking", include_in_schema=False)
async def booking(request: Request):
    return FileResponse("./static/booking.html", media_type="text/html")


@app.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
    return FileResponse("./static/thankyou.html", media_type="text/html")

# Week1: Attraction/MRT API


@app.get("/api/attractions", response_class=JSONResponse)
async def get_attractions(page: int = 0, keyword: str | None = None):
    # fetch for 13 and return 12
    try:
        if keyword is None:
            sql = "SELECT * FROM attractions LIMIT 13 OFFSET %s"
            val = (page*12,)
        else:
            sql = "SELECT * FROM attractions WHERE name LIKE %s OR mrt LIKE %s LIMIT 13 OFFSET %s"
            val = (f'%{keyword}%', f'%{keyword}%', page*12)
        list = await fetchJSON(sql, val, True)
        # Cond 1: There's data on next page, return only 12(Success)
        if len(list) > 12:
            # return from 0 to 11, 12 not included
            return JSONResponse(status_code=200, content={"nextPage": page+1, "data": list[0:12]})
        # Cond 2: There's no data on next page.(Success)
        elif 12 >= len(list) > 0:
            return JSONResponse(status_code=200, content={"nextPage": None, "data": list})
        # Cond 3: No data is fetched even on first page.(Failed)
        elif len(list) == 0 and page == 0:
            return JSONResponse(status_code=500, content={"error": True, "message": "關鍵字查無資料"})
        # Cond 4: No data is fetched.(Failed)
        else:
            return JSONResponse(status_code=500, content={"error": True, "message": "已達資料底端"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": True, "message": e})


@app.get("/api/attraction/{attractionID}", response_class=JSONResponse)
async def get_attraction_byID(attractionID: int):
    try:
        sql = "SELECT * FROM attractions WHERE id = %s"
        val = (attractionID,)
        list = await fetchJSON(sql, val, True)
        if len(list) == 0:
            return JSONResponse(status_code=400, content={"error": True, "message": "景點編號不正確"})
        else:
            obj = list[0]
            return JSONResponse(status_code=200, content={"data": obj})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": True, "message": e})


@app.get("/api/mrts", response_class=JSONResponse)
async def get_MRTs():
    try:
        sql = "SELECT mrt FROM attractions\
				GROUP BY mrt\
				ORDER BY COUNT(name) DESC"
        myresult = await fetchJSON(sql, None, False)
        list = []
        for mrt in myresult:
            if mrt[0] is not None:
                list.append(mrt[0])
        return JSONResponse(status_code=200, content={"data": list})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": True, "message": e})

# User registration

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


@app.post("/api/user", response_class=JSONResponse)
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


class UserSignInInput(BaseModel):
    email: EmailStr = Field(..., max_length=50)
    password: str = Field(..., min_length=8, max_length=20,)

    @field_validator('password')
    def password_pattern(cls, v):
        if re.match(pattern_password, v) is None:
            raise ValueError(
                'password should contain at least 1 uppercase, 1 lowercase and 1 number.')
        return v


@app.put("/api/user/auth", response_class=JSONResponse)
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
                response, JWTkey, algorithm="HS256")
            # Construct response
            response = {
                "token": encoded_response
            }
            return JSONResponse(
                status_code=200,
                content=response
            )


class User(BaseModel):
    id: int
    name: str = Field(..., min_length=3, max_length=30,
                      pattern=pattern_name)
    email: EmailStr

class ReturnUser(BaseModel):
    data: User | None


@app.get("/api/user/auth", response_model=ReturnUser)
async def user_validation(request: Request, Authorization: str = Header(None)):

    try:
        if Authorization is None:
            response = {
                "data": None
            }
        else:
            user_data = jwt.decode(Authorization, JWTkey, algorithms="HS256")

            response = {
                "data": {
                    "id": user_data['id'],
                    "name": user_data['name'],
                    "email": user_data['email']
                }
            }
    
    # If token expired or decoded wrong
    except (jwt.ExpiredSignatureError, jwt.DecodeError, Exception):
        response = {
            "data": None
        }
    finally:
        return JSONResponse(
            status_code=200,
            content=response
        )

# Error handler


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content=jsonable_encoder({
            "error": True,
            "message": str(f"{exc.errors()[0]['loc'][1]}:{exc.errors()[0]['msg']}")
        })
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder({
            "error": True,
            "message": str(exc.detail)
        })
    )

# Global function


async def fetchJSON(sql, val=None, dictionary=False):
    try:
        cnxconnection = cnxpool.get_connection()
        mycursor = cnxconnection.cursor(dictionary=dictionary)
        mycursor.execute(sql, val)
        myresult = mycursor.fetchall()

        for data in myresult:
            # parse for grid data
            if (len(data) == 10):
                print("fetch JSONresponse, parse data type.")
            # JSONresponse need a float type than decimal
                data["lat"] = float(data["lat"])
                data["lng"] = float(data["lng"])
                data["images"] = data["images"].split(',')

    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # close connection
        mycursor.close()
        cnxconnection.close()
        print("MySQL connection is closed")
        return myresult


def commitDB(sql, val=None):
    try:
        cnxconnection = cnxpool.get_connection()
        mycursor = cnxconnection.cursor()
        mycursor.execute(sql, val)
        cnxconnection.commit()
        print(mycursor.rowcount, "record inserted.")
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
    finally:
        # close connection
        mycursor.close()
        cnxconnection.close()
        print("MySQL connection is closed")
