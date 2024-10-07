from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from starlette import status
import string
import random
import json
from app.function.function import user_validation, check_booking, commitDB
from app.function.basemodel import Error, PostOrderSuccess, PostOrder, OrderResponse
import requests
import sys
from typing import Annotated

sys.stdout.reconfigure(encoding="utf-8")

router = APIRouter(
    prefix="/api/orders",
    tags=["orders"],
    dependencies=[Depends(user_validation)],
    responses={
        403: {"model": Error, "description": "未登入系統，拒絕存取"},
        422: {"model": Error, "description": "輸入格式錯誤"},
        500: {"model": Error, "description": "伺服器內部錯誤"},
    },
)


@router.post(
    "",
    responses={
        200: {
            "model": PostOrderSuccess,
            "description": "訂單建立成功，包含付款狀態 ( 可能成功或失敗 )",
        },
        400: {"model": Error, "description": "訂單建立失敗，輸入不正確或其他原因"},
    },
    response_class=JSONResponse,
    summary="建立新的訂單，並完成付款程序",
)
async def payment_TapPay(
    reqest: Request, order: PostOrder, user: Annotated[dict, Depends(user_validation)]
):
    try:
        # Insert into orders table
        sql1 = "SELECT id from booking\
            WHERE user_id = %s ORDER BY id desc LIMIT 1"
        val1 = (user["id"],)
        result = await check_booking(sql1, val1)
        order_number = "".join(
            random.choices(string.ascii_letters + string.digits, k=50)
        )

        sql2 = "INSERT INTO orders\
            (booking_id, order_number, contact_name, contact_email, contact_phone, prime_number, payment_status)\
            VALUES (%s, %s, %s, %s, %s, %s, %s)"
        val2 = (
            result[0][0],
            order_number,
            order.order.contact.name,
            order.order.contact.email,
            order.order.contact.phone,
            order.prime,
            "UNPAID",
        )
        commitDB(sql2, val2)

        # make request to Tappay
        tappay_url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        partner_key = "partner_MWolLkvQ1R4JQGVp6W2N7yNl15PEYfNBSRUlV14n5TxAbr6oxz33YmSK"
        merchant_id = "J842671395_TAISHIN"

        respond = requests.post(
            url=tappay_url,
            json={
                "prime": order.prime,
                "partner_key": partner_key,
                "merchant_id": merchant_id,
                "order_number": order_number,
                "details": "Tappay Test",
                "amount": order.order.price,
                "cardholder": {
                    "phone_number": order.order.contact.phone,
                    "name": order.order.contact.name,
                    "email": order.order.contact.email,
                },
            },
            headers={"Content-Type": "application/json", "x-api-key": partner_key},
        )
        response = respond.json()
        # if success, change to 'PAID' in database
        if response["status"] == 0:
            sql = "UPDATE orders SET payment_status = 'PAID' WHERE order_number = %s"
            val = (response["order_number"],)
            commitDB(sql, val)
        # construct response to front-end
        status_code = status.HTTP_200_OK
        response_obj = {
            "data": {
                "number": order_number,
                "payment": {"status": response["status"], "message": response["msg"]},
            }
        }

    except (requests.ConnectionError, requests.Timeout) as e:
        status_code = status.HTTP_400_BAD_REQUEST
        response_obj = {"error": True, "message": f"Network Error: {str(e)}"}

    except (json.JSONDecodeError, KeyError, IndexError, ValueError, Exception) as e:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        response_obj = {"error": True, "message": f"Network Error: {str(e)}"}

    finally:
        return JSONResponse(status_code=status_code, content=response_obj)


@router.get(
    "/{orderNumber}",
    responses={
        200: {
            "model": OrderResponse,
            "description": "根據訂單編號取得訂單資訊，null 表示沒有資料",
        }
    },
    response_class=JSONResponse,
    summary="根據訂單編號取得訂單資訊",
)
async def get_orders(
    reqest: Request, orderNumber: str, user: Annotated[dict, Depends(user_validation)]
):
    try:
        sql = """
        SELECT\
          booking.price AS price,\
            attractions.id AS id,\
              attractions.name AS name,\
                attractions.address AS address,\
                  attractions.images AS images,\
                    booking.date AS date,\
                      booking.time AS time,\
                        orders.order_number AS order_number,\
                          orders.contact_name AS contact_name,\
                            orders.contact_email AS email,\
                              orders.contact_phone AS phone,\
                                orders.payment_status AS status\
        FROM booking\
        INNER JOIN orders ON booking.id = orders.booking_id\
        INNER JOIN attractions ON attractions.id = booking.attraction_id\
        WHERE order_number = %s
        """
        val = (orderNumber,)
        result = await check_booking(sql, val)

        if len(result) > 0:
            if result[0][11] == "PAID":
                payment_status = 1
            elif result[0][11] == "UNPAID":
                payment_status = 0
            status_code = status.HTTP_200_OK
            response_obj = {
                "data": {
                    "number": orderNumber,
                    "price": result[0][0],
                    "trip": {
                        "attraction": {
                            "id": result[0][1],
                            "name": result[0][2],
                            "address": result[0][3],
                            "image": result[0][4].split(",")[0],
                        },
                        "date": str(result[0][5]),
                        "time": result[0][6],
                    },
                    "contact": {
                        "name": result[0][8],
                        "email": result[0][9],
                        "phone": result[0][10],
                    },
                    "status": payment_status,
                }
            }
        else:
            status_code = status.HTTP_200_OK
            response_obj = {"data": None}
    except (json.JSONDecodeError, KeyError, IndexError, ValueError, Exception) as e:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        response_obj = {"error": True, "message": f"Network Error: {str(e)}"}
    finally:
        return JSONResponse(status_code=status_code, content=response_obj)
