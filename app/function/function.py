import sys
from dotenv import load_dotenv
import os
from mysql.connector import Error, ProgrammingError, OperationalError, pooling
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Annotated
import jwt
from starlette import status

# connection to mysql
load_dotenv()
DBpassword = os.getenv('DBpassword')
JWTkey = os.getenv('JWTkey')

sys.stdout.reconfigure(encoding='utf-8')

# connection pool
dbconfig = {
    'host': "wehelp-parking-lot.cnc4cy8wmip0.ap-southeast-2.rds.amazonaws.com",
    'user': "taipeidaytrip",
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
        print(mycursor.rowcount, "record processed.")
    except OperationalError as e:
        print("Operational Error while connecting to MySQL using Connection pool ", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Lost MySQL connection"
        )
    except ProgrammingError as e:
        print("Programming Error: Invalid SQL script ", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid SQL script"
        )
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Other MySQL error occurred"
        )
    finally:
        # close connection
        mycursor.close()
        cnxconnection.close()
        print("MySQL connection is closed")

security = HTTPBearer()
def user_validation(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]):
    token = credentials.credentials or None
    try:
        payload = jwt.decode(token, JWTkey, algorithms="HS256")
        yield payload
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token: " + str(e)
        )
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="JWT error: " + str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token validation error: " + str(e)
        )

async def check_booking(sql, val=None):
    try:
        cnxconnection = cnxpool.get_connection()
        mycursor = cnxconnection.cursor()
        mycursor.execute(sql, val)
        myresult = mycursor.fetchall()

    except OperationalError as e:
        print("Operational Error while connecting to MySQL using Connection pool ", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Lost MySQL connection"
        )
    except ProgrammingError as e:
        print("Programming Error: Invalid SQL script ", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid SQL script"
        )
    except Error as e:
        print("Error while connecting to MySQL using Connection pool ", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Other MySQL error occurred"
        )
    finally:
        # close connection
        mycursor.close()
        cnxconnection.close()
        print("MySQL connection is closed")
        return myresult
