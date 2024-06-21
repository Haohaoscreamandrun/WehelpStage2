import sys
from dotenv import load_dotenv
import os
from mysql.connector import Error, pooling

# connection to mysql
load_dotenv()
DBpassword = os.getenv('DBpassword')
sys.stdout.reconfigure(encoding='utf-8')

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
