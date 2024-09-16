# The line sys.stdout.reconfigure(encoding='utf-8') attempts to reconfigure the standard output stream(sys.stdout) to use UTF-8 encoding
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi import *
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

import sys
sys.stdout.reconfigure(encoding='utf-8')

# router

from .routers import attractions, user, booktrip, order

# Server

app = FastAPI()

# Router include

app.include_router(attractions.router)
app.include_router(user.router)
app.include_router(booktrip.router)
app.include_router(order.router)

# Static files

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


# Error handler

# fastAPI - When a request contains invalid data, FastAPI internally raises a RequestValidationError
# RequestValidationError is a sub-class of Pydantic's ValidationError
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={
            "error": True,
            "message": str(f"{exc.errors()[0]['loc'][1]}:{exc.errors()[0]['msg']}")
        }
    )

# And FastAPI's HTTPException error class inherits from Starlette's HTTPException error class.
# The only difference is that FastAPI's HTTPException accepts any JSON-able data for the detail field, while Starlette's HTTPException only accepts strings for it.
# But when you register an exception handler, you should register it for Starlette's HTTPException.
# This way, if any part of Starlette's internal code, or a Starlette extension or plug-in, raises a Starlette HTTPException, your handler will be able to catch and handle it
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": str(exc.detail)
        }
    )
