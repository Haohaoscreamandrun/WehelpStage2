from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from datetime import date
from typing import Annotated
from starlette import status
from app.function.function import user_validation, check_booking, commitDB
from app.function.basemodel import Error, GetBookingSuccess, Success, BookingInput

import sys

sys.stdout.reconfigure(encoding="utf-8")

router = APIRouter(
    prefix="/api/booking",
    tags=["booking"],
    dependencies=[Depends(user_validation)],
    responses={
        403: {"model": Error, "description": "未登入系統，拒絕存取"},
        422: {"model": Error, "description": "輸入格式錯誤"},
        500: {"model": Error, "description": "伺服器內部錯誤"},
    },
)


@router.get(
    "",
    responses={
        200: {"model": GetBookingSuccess, "description": "建立成功"},
        400: {"model": Error, "description": "建立失敗，輸入不正確或其他原因"},
    },
    response_class=[JSONResponse],
    summary="取得尚未確認下單的預定行程",
)
async def getBookings(user: Annotated[dict, Depends(user_validation)]):
    try:
        sql = """
        SELECT\
            attractions.id AS id,\
                attractions.name AS name,\
                    attractions.address AS address,\
                        attractions.images AS image,\
                            booking.id AS booking_id,\
                                booking.user_id AS user_id,\
                                    booking.date AS date,\
                                        booking.time AS time,\
                                            booking.price AS price,\
                                                orders.payment_status AS status\
        From booking\
        INNER JOIN attractions ON booking.attraction_id = attractions.id\
        LEFT JOIN orders ON booking.id = orders.booking_id\
        WHERE user_id = %s AND orders.booking_id IS NULL
        """
        val = (user["id"],)

        get_booking = await check_booking(sql, val)
        if len(get_booking) > 0:
            data = {
                "attraction": {
                    "id": get_booking[0][0],
                    "name": get_booking[0][1],
                    "address": get_booking[0][2],
                    "image": get_booking[0][3].split(",")[0],
                },
                "date": str(get_booking[0][6]),
                "time": get_booking[0][7],
                "price": get_booking[0][8],
            }

            content = {"data": data}

        else:
            content = {"data": None}

        return JSONResponse(status_code=status.HTTP_200_OK, content=content)

    except HTTPException as e:
        response = Error(error=True, message=e.detail)
        return JSONResponse(status_code=e.status_code, content=dict(response))


@router.post(
    "",
    responses={
        200: {"model": Success, "description": "建立成功"},
        400: {"model": Error, "description": "建立失敗，輸入不正確或其他原因"},
    },
    response_class=JSONResponse,
    summary="建立新的預定行程",
)
async def postBookings(
    bookingInput: BookingInput, user: Annotated[dict, Depends(user_validation)]
):
    # Check if the date earlier than or equal to today
    inputY, inputM, inputD = [int(x) for x in str(bookingInput.date).split("-")]
    today = date.today()
    inputDay = date(inputY, inputM, inputD)
    if inputDay <= today:
        response = Error(error=True, message="請選擇預約明天之後的日期。")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, content=dict(response)
        )
    try:
        user_id = user["id"]
        sql = """
        SELECT \
            booking.id AS booking_id,\
                booking.user_id AS user_id,\
                    orders.id AS orders_id,\
                        orders.payment_status AS payment_status\
        FROM booking\
        LEFT JOIN orders ON booking.id = orders.booking_id\
        WHERE user_id = %s
        """
        val = (user_id,)
        user_booking = await check_booking(sql, val)
        # Cond1: order exist
        if len(user_booking) != 0:
            for booking in user_booking:
                # Cond1-1: UNPAID order exist
                if booking[3] == "UNPAID":
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="有未付款成功訂單，請於付款成功後再加入下一筆。",
                    )
                # Cond1-2: orders other than PAID exist
                elif booking[3] is None:
                    # Delete exist booking which is not in order
                    sql = "DELETE FROM booking WHERE id = %s"
                    val = (booking[0],)
                    commitDB(sql, val)

        # Cond2: booking not exist
        # Insert new one
        sql = """
        INSERT INTO booking\
            (user_id, attraction_id, date, time, price)\
        VALUES (%s, %s, %s, %s, %s)
        """
        val = (
            user["id"],
            bookingInput.attractionId,
            bookingInput.date,
            bookingInput.time,
            bookingInput.price,
        )
        commitDB(sql, val)
        response = Success(ok=True)
        return JSONResponse(status_code=status.HTTP_200_OK, content=dict(response))
    except HTTPException as e:
        response = Error(error=True, message=e.detail)
        return JSONResponse(status_code=e.status_code, content=dict(response))


@router.delete(
    "",
    responses={200: {"model": Success, "description": "建立成功"}},
    response_class=JSONResponse,
    summary="刪除目前的預定行程",
)
async def deleteBookings(user: Annotated[dict, Depends(user_validation)]):
    try:
        sql = """
        DELETE FROM booking WHERE user_id = %s\
        ORDER BY id desc LIMIT 1
        """
        val = (user["id"],)
        commitDB(sql, val)
        response = Success(ok=True)
        return JSONResponse(status_code=status.HTTP_200_OK, content=dict(response))
    except HTTPException as e:
        response = Error(error=True, message=e.detail)
        return JSONResponse(status_code=e.status_code, content=dict(response))
