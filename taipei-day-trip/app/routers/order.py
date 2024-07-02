from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from starlette import status
from app.function.function import *
from app.function.basemodel import *
import requests
import sys
sys.stdout.reconfigure(encoding='utf-8')

router = APIRouter(
    prefix="/api/orders",
    tags=["orders"],
    dependencies=[Depends(user_validation)],
    responses={
        403: {'model': Error, 'description': "未登入系統，拒絕存取"},
        422: {'model': Error,
              'description': "輸入格式錯誤"
              },
        500: {'model': Error, 'description': '伺服器內部錯誤'}
    }
)


@router.post("", responses={
  200: {'model': PostOrderSuccess, 'description': "訂單建立成功，包含付款狀態 ( 可能成功或失敗 )"},
  400: {'model': Error, 'description': '訂單建立失敗，輸入不正確或其他原因'}
}, response_class= JSONResponse, summary= "建立新的訂單，並完成付款程序")
async def payment_TapPay(reqest: Request, order: PostOrder, user: Annotated[dict, Depends(user_validation)]):
  try:
    # Insert into orders table
    sql1 = 'SELECT id from booking\
            WHERE user_id = %s'
    val1 = (user['id'],)
    result = await check_booking(sql1, val1)
    sql2 = 'INSERT INTO orders\
            (booking_id, contact_name, contact_email,\
            contact_phone, prime_number, payment_status)\
            VALUES (%s, %s, %s, %s, %s, %s)'
    val2 = (result[0][0], order.order.contact.name,
            order.order.contact.email, order.order.contact.phone, order.prime, 'UNPAID')
    commitDB(sql2, val2)

    # make request to Tappay
    tappay_url = 'https: // sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
    partner_key = 'partner_MWolLkvQ1R4JQGVp6W2N7yNl15PEYfNBSRUlV14n5TxAbr6oxz33YmSK'
    merchant_id = 'J842671395_JKOPAY'
    
  except Exception as e:
    print(e)