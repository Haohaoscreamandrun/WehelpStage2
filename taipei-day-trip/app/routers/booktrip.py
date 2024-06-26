from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel, AnyUrl
from datetime import date
from typing import Literal
from typing import Annotated
from datetime import *
from starlette import status
from app.function.function import user_validation, commitDB, check_booking

import sys
sys.stdout.reconfigure(encoding='utf-8')

router = APIRouter(
    prefix="/api/booking",
    tags=["booking"],
    dependencies=[Depends(user_validation)]
)


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

@router.get("", responses={
    200: {'model': GetBookingSuccess, 'description': "建立成功"},
    400: {'model': Error, 'description': '建立失敗，輸入不正確或其他原因'}
    }, response_class = JSONResponse, summary = "取得尚未確認下單的預定行程")
async def getBookings(user: Annotated[dict, Depends(user_validation)]):

    try:
        sql = 'SELECT \
            attractions.id AS id,\
            attractions.name AS name,\
            attractions.address AS address,\
            attractions.images AS image,\
            booking.user_id AS user_id,\
            booking.date AS date,\
            booking.time AS time,\
            booking.price AS price\
            From attractions\
            INNER JOIN booking ON attractions.id = booking.attraction_id\
            WHERE user_id = %s'
        val = (user['id'],)
        get_booking = await check_booking(sql, val)
        if (get_booking != None):
            content = BookingAttraction(
                id=get_booking[0][0],
                name=get_booking[0][1],
                address=get_booking[0][2],
                image=get_booking[0][3].split(",")[0]
            )
            content = Booking(
                attraction=content,
                date=get_booking[0][5],
                time=get_booking[0][6],
                price=get_booking[0][7]
            )
            content = GetBookingSuccess(
                data=content
            )
        else:
            content = GetBookingSuccess(
                data= None
            )
        content = content.model_dump_json()
        return JSONResponse(
            status_code= status.HTTP_200_OK,
            content=content
        )
    except HTTPException as e:
        response = Error(
            error=True,
            message=e.detail
        )
        return JSONResponse(
            status_code=e.status_code,
            content=response.model_dump_json()
        )


@router.post("", responses={
    200: {'model': Success, 'description': "建立成功"},
    400: {'model': Error, 'description': '建立失敗，輸入不正確或其他原因'},
    403: {'model': Error, 'description': "未登入系統，拒絕存取"},
    500: {'model': Error, 'description': '伺服器內部錯誤'}
    },response_class=JSONResponse, summary="建立新的預定行程")
async def getBookings(bookingInput: BookingInput, user: Annotated[dict, Depends(user_validation)]):
    
    # Check if the date earlier than or equal to today
    inputY, inputM, inputD = [int(x) for x in str(bookingInput.date).split('-')]
    today = date.today()
    inputDay = date(inputY, inputM, inputD)
    if (inputDay <= today):
        response = Error(
            error= True,
            message= "請選擇預約明天之後的日期。"
        )
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=response.model_dump_json()
        )
    try:
        user_id = user['id']
        sql = "SELECT * FROM booking\
                WHERE user_id = %s"
        val = (user_id,)
        user_booking = await check_booking(sql, val)
        # Delete record if there's already one
        if (len(user_booking) > 0):
            sql = "DELETE FROM booking WHERE user_id = %s"
            val = (user_id,)
            commitDB(sql, val)
        # Insert new one
        sql = 'INSERT INTO booking\
                (user_id, attraction_id, date, time, price)\
                VALUES (%s, %s, %s, %s, %s)'
        val = (user['id'], bookingInput.attractionId,
               bookingInput.date, bookingInput.time, bookingInput.price,)
        commitDB(sql, val)
        response = Success(
            ok=True
        )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=response.model_dump_json()
        )
    except HTTPException as e:
        response = Error(
            error=True,
            message=e.detail
        )
        return JSONResponse(
            status_code=e.status_code,
            content=response.model_dump_json()
        )


@router.delete("",responses={
    200: {'model': Success, 'description': "建立成功"},
    403: {'model': Error, 'description': "未登入系統，拒絕存取"}
    }, response_class=JSONResponse, summary="刪除目前的預定行程")
async def getBookings(user: Annotated[dict, Depends(user_validation)]):
    try:
        sql = "DELETE FROM booking WHERE user_id = %s"
        val = (user['id'],)
        commitDB(sql, val)
        response = Success(
            ok=True
        )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=response.model_dump_json()
        )
    except HTTPException as e:
        response = Error(
            error=True,
            message=e.detail
        )
        return JSONResponse(
            status_code=e.status_code,
            content=response.model_dump_json()
        )

