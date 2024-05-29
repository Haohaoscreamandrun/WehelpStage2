# The line sys.stdout.reconfigure(encoding='utf-8') attempts to reconfigure the standard output stream(sys.stdout) to use UTF-8 encoding
import sys
sys.stdout.reconfigure(encoding='utf-8')

# connection to mysql
import os
from dotenv import load_dotenv
import mysql.connector
load_dotenv()
DBpassword = os.getenv('DBpassword')

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password=DBpassword,
    database="attractions"
)
mycursor = mydb.cursor()


# Server

from fastapi import *
from fastapi.responses import FileResponse, JSONResponse
app=FastAPI()

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

@app.get("/api/attractions", response_class= JSONResponse)
async def get_attractions(page: int = 0, keyword: str | None = None):
	try:
		if keyword is None:
			sql = "SELECT * FROM attractions LIMIT 12 OFFSET %s"
			val = (page*12,)
		else:
			sql = "SELECT * FROM attractions WHERE name LIKE %s OR mrt LIKE %s LIMIT 12 OFFSET %s"
			val = (f'%{keyword}%', f'%{keyword}%', page*12)
		list = await fetchJSON(sql, val)
		if len(list) > 0:
			return JSONResponse(status_code=200, content={"nextPage":page+1 ,"data": list})
		elif len(list) == 0 and page == 0:
			return JSONResponse(status_code=500, content={"error": True, "message": "關鍵字查無資料"})
		else:
			return JSONResponse(status_code=500, content={"error": True, "message": "已達資料底端"})
	except Exception as e:
		return JSONResponse(status_code=500, content={"error": True, "message": e})

@app.get("/api/attractions/{attractionID}", response_class=JSONResponse)
async def get_attraction_byID(attractionID: int):
	try:
		sql = "SELECT * FROM attractions WHERE id = %s"
		val = (attractionID,)
		list = await fetchJSON(sql, val)
		if len(list) == 0:
			return JSONResponse(status_code=400, content={"error": True, "message": "景點編號不正確"})
		else:
			obj = list[0]
			return JSONResponse(status_code=200, content={"data": obj})
	except Exception as e:
		return JSONResponse(status_code=500, content={"error": True, "message": e})

# Global function
async def fetchJSON(sql, val):
	mycursor.execute(sql, val)
	myresult = mycursor.fetchall()
	list = []
	for data in myresult:
		attraction_object = {
			"id": data[0],
			"name": data[1],
			"category": data[2],
			"description": data[3],
			"address": data[4],
			"transport": data[5],
			"mrt": data[6],
			# JSON doesn't natively support Decimal objects, so you need to convert them to a JSON-serializable type before serializing.
			"lat": float(data[7]),
			"lng": float(data[8]),
			"images": data[9].split(",")
		}
		list.append(attraction_object)
	return list