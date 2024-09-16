from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.function.function import *
import sys
sys.stdout.reconfigure(encoding='utf-8')

router = APIRouter(
  prefix="/api",
  tags=["attractions"]
)


@router.get("/attractions", response_class=JSONResponse)
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

@router.get("/attraction/{attractionID}", response_class=JSONResponse)
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


@router.get("/mrts", response_class=JSONResponse)
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


