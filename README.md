# Taipei Day Trip

## Project Overview

This project is an e-commerce website that allows users to book and pay for trips. The system features a fully functional frontend, backend, payment system, and deployment infrastructure.

## Tech Stack

- Frontend: Vanilla JavaScript, HTML, CSS
- Backend: Python (FastAPI)
- Database: MySQL (Hosted on AWS RDS)
- Payment Integration: TapPay (Pay by Prime API for credit card payments)
- Deployment: Docker (Deployed on AWS EC2)

## Features

- User Registration and Authentication
- Browse and book trips
- Add trips to the shopping cart
- Order management system
- Credit card payment via TapPay
- Responsive user interface

## Structure

WehelpStage2/
┣ app/
┃ ┣ function/
┃ ┃ ┣ basemodel.py
┃ ┃ ┗ function.py
┃ ┣ routers/
┃ ┃ ┣ attractions.py
┃ ┃ ┣ booktrip.py
┃ ┃ ┣ order.py
┃ ┃ ┗ user.py
┃ ┣ app.py
┃ ┗ loading.py
┣ data/
┃ ┗ taipei-attractions.json
┣ function/
┃ ┣ attraction/
┃ ┃ ┣ bookSubmit.js
┃ ┃ ┣ fetch.js
┃ ┃ ┣ pagination.js
┃ ┃ ┗ price.js
┃ ┣ booking/
┃ ┃ ┣ bookDelete.js
┃ ┃ ┣ bookRender.js
┃ ┃ ┗ tappay.js
┃ ┣ common/
┃ ┃ ┣ member.js
┃ ┃ ┣ nav_button.js
┃ ┃ ┣ panel.js
┃ ┃ ┣ server.js
┃ ┃ ┗ token.js
┃ ┣ index/
┃ ┃ ┣ fetch.js
┃ ┃ ┗ search.js
┃ ┣ thankyou/
┃ ┃ ┗ fetch.js
┃ ┣ attraction.js
┃ ┣ booking.js
┃ ┣ index.js
┃ ┗ thankyou.js
┣ source/
┃ ┣ icon_close.png
┃ ┣ icon_delete.png
┃ ┣ icon_search.png
┃ ┣ left arrow.png
┃ ┣ right arrow.png
┃ ┣ taipei_icon.png
┃ ┗ welcome.png
┣ static/
┃ ┣ attraction.html
┃ ┣ booking.html
┃ ┣ index.html
┃ ┗ thankyou.html
┣ style/
┃ ┗ style.css
┣ .dockerignore
┣ .gitignore
┣ compose.yaml
┣ Dockerfile
┣ README.Docker.md
┣ README.md
┗ requirements.txt

## Deployment

- The project is containerized using Docker and deployed on AWS EC2.
- The database is hosted on AWS RDS.

## Environment variables

Hidden .env file contains necessary credentials and configurations for AWS, MySQL, and TapPay.

## API Endpoints

[Swagger docs](https://taipeidaytrip.haohaoscreamandrun.online/docs)