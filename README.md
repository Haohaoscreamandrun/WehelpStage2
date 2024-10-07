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

- [app/](./app)
  - [function/](./app/function)
    - [basemodel.py](./app/function/basemodel.py)
    - [function.py](./app/function/function.py)
  - [routers/](./app/routers)
    - [attractions.py](./app/routers/attractions.py)
    - [booktrip.py](./app/routers/booktrip.py)
    - [order.py](./app/routers/order.py)
    - [user.py](./app/routers/user.py)
  - [app.py](./app/app.py)
  - [loading.py](./app/loading.py)
- [data/](./data)
  - [taipei-attractions.json](./data/taipei-attractions.json)
- [function/](./function)
  - [attraction/](./function/attraction)
    - [bookSubmit.js](./function/attraction/bookSubmit.js)
    - [fetch.js](./function/attraction/fetch.js)
    - [pagination.js](./function/attraction/pagination.js)
    - [price.js](./function/attraction/price.js)
  - [booking/](./function/booking)
    - [bookDelete.js](./function/booking/bookDelete.js)
    - [bookRender.js](./function/booking/bookRender.js)
    - [tappay.js](./function/booking/tappay.js)
  - [common/](./function/common)
    - [member.js](./function/common/member.js)
    - [nav_button.js](./function/common/nav_button.js)
    - [panel.js](./function/common/panel.js)
    - [server.js](./function/common/server.js)
    - [token.js](./function/common/token.js)
  - [index/](./function/index)
    - [fetch.js](./function/index/fetch.js)
    - [search.js](./function/index/search.js)
  - [thankyou/](./function/thankyou)
    - [fetch.js](./function/thankyou/fetch.js)
  - [attraction.js](./function/attraction.js)
  - [booking.js](./function/booking.js)
  - [index.js](./function/index.js)
  - [thankyou.js](./function/thankyou.js)
- [source/](./source)
  - [icon_close.png](./source/icon_close.png)
  - [icon_delete.png](./source/icon_delete.png)
  - [icon_search.png](./source/icon_search.png)
  - [left_arrow.png](./source/left_arrow.png)
  - [right_arrow.png](./source/right_arrow.png)
  - [taipei_icon.png](./source/taipei_icon.png)
  - [welcome.png](./source/welcome.png)
- [static/](./static)
  - [attraction.html](./static/attraction.html)
  - [booking.html](./static/booking.html)
  - [index.html](./static/index.html)
  - [thankyou.html](./static/thankyou.html)
- [style/](./style)
  - [style.css](./style/style.css)
- [.dockerignore](./.dockerignore)
- [.gitignore](./.gitignore)
- [compose.yaml](./compose.yaml)
- [Dockerfile](./Dockerfile)
- [README.Docker.md](./README.Docker.md)
- [README.md](./README.md)
- [requirements.txt](./requirements.txt)

## Deployment

- The project is containerized using Docker and deployed on AWS EC2.
- The database is hosted on AWS RDS.

## Environment variables

Hidden .env file contains necessary credentials and configurations for AWS, MySQL, and TapPay.
