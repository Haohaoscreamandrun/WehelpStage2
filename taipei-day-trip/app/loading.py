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
    user="jimmy",
    password=DBpassword,
    database="attractions"
)
mycursor = mydb.cursor()

# create table in database

sql = 'CREATE TABLE attractions(\
	id BIGINT AUTO_INCREMENT PRIMARY KEY,\
	name VARCHAR(20),\
	category VARCHAR(5),\
	description TEXT,\
	address VARCHAR(30),\
	transport VARCHAR(500),\
	mrt VARCHAR(10),\
	lat DECIMAL(10, 8),\
	lng DECIMAL(11, 8),\
	images TEXT\
	)'# text

try:
	mycursor.execute(sql)
	print("Table 'attractions' created successfully.")
except mysql.connector.errors.ProgrammingError as e:
	if e.errno == 1050:
		print("Table 'attractions' already exists.")
	else:
		print("An error occurred when create table in MySQL.")

# import json

import re
from decimal import Decimal
import json

# open json file

# path = os.path.join('.', 'taipei-day-trip','data', 'taipei-attractions.json')
current_dir = os.path.dirname(__file__)
new_path = os.path.join(current_dir, '..', 'data', 'taipei-attractions.json')
print(new_path)

with open(new_path, encoding="utf-8") as file:
	attractions_objects = json.load(file)

attractions_objects_list = attractions_objects["result"]["results"]

# iterate the list and insert

sql = 'INSERT INTO attractions\
	(name, category, description, address, transport, mrt, lat, lng, images)\
	VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)'

# make sure only insert once
mycursor.execute("SELECT * FROM attractions")
myresult = mycursor.fetchall()

if len(myresult) == 0:
	for object in attractions_objects_list:
		name = object["name"]
		category = object["CAT"]
		description = object["description"]
		address = object["address"]
		transport = object["direction"]
		mrt = object["MRT"]
		lat = Decimal(object["latitude"])
		lng = Decimal(object["longitude"])
		# split the string with 'https' pattern
		temp_images = re.split('https', object["file"])
		# filter through the array with 2 endings and add 'https' in front.
		temp_images = [
			'https' + url for url in temp_images if url.lower().endswith(('jpg', 'png'))]
		# rejoin them with ',' separation
		images = ','.join(temp_images)

		val = (name, category, description, address,
		       transport, mrt, lat, lng, images,)

		try:
			mycursor.execute(sql, val)
			mydb.commit()
			print(mycursor.rowcount, "record inserted.")
		except mysql.connector.errors.ProgrammingError as e:
			print(e)
else:
	print("Data is already inserted.")

# CREATE member table
## CHECK IF THE TABLE EXIST

sql = 'CREATE TABLE member(\
	id BIGINT AUTO_INCREMENT PRIMARY KEY,\
	name VARCHAR(30),\
	email VARCHAR(50),\
	password VARCHAR(20)\
	)'

try:
	mycursor.execute(sql)
	print("Table 'member' created successfully.")
except mysql.connector.errors.ProgrammingError as e:
	if e.errno == 1050:
		print("Table 'member' already exists.")
	else:
		print("An error occurred when create table in MySQL.")

sql = 'CREATE TABLE booking(\
	id BIGINT AUTO_INCREMENT PRIMARY KEY,\
	user_id BIGINT,\
	attraction_id BIGINT,\
	date DATE,\
	time VARCHAR(10),\
	price INT,\
	FOREIGN KEY (user_id) REFERENCES member(id),\
	FOREIGN KEY (attraction_id) REFERENCES attractions(id)\
	);'

try:
	mycursor.execute(sql)
	print("Table 'booking' created successfully.")
except mysql.connector.errors.ProgrammingError as e:
	if e.errno == 1050:
		print("Table 'booking' already exists.")
	else:
		print("An error occurred when create table in MySQL.",e)

mydb.close()