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

- [app/](.\WehelpStage2\app)
  - [function/](.\WehelpStage2\app\function)
    - [basemodel.py](.\WehelpStage2\app\function\basemodel.py)
    - [function.py](.\WehelpStage2\app\function\function.py)
  - [routers/](.\WehelpStage2\app\routers)
    - [attractions.py](.\WehelpStage2\app\routers\attractions.py)
    - [booktrip.py](.\WehelpStage2\app\routers\booktrip.py)
    - [order.py](.\WehelpStage2\app\routers\order.py)
    - [user.py](.\WehelpStage2\app\routers\user.py)
  - [app.py](.\WehelpStage2\app\app.py)
  - [loading.py](.\WehelpStage2\app\loading.py)
- [data/](.\WehelpStage2\data)
  - [taipei-attractions.json](.\WehelpStage2\data\taipei-attractions.json)
- [function/](.\WehelpStage2\function)
  - [attraction/](.\WehelpStage2\function\attraction)
    - [bookSubmit.js](.\WehelpStage2\function\attraction\bookSubmit.js)
    - [fetch.js](.\WehelpStage2\function\attraction\fetch.js)
    - [pagination.js](.\WehelpStage2\function\attraction\pagination.js)
    - [price.js](.\WehelpStage2\function\attraction\price.js)
  - [booking/](.\WehelpStage2\function\booking)
    - [bookDelete.js](.\WehelpStage2\function\booking\bookDelete.js)
    - [bookRender.js](.\WehelpStage2\function\booking\bookRender.js)
    - [tappay.js](.\WehelpStage2\function\booking\tappay.js)
  - [common/](.\WehelpStage2\function\common)
    - [member.js](.\WehelpStage2\function\common\member.js)
    - [nav_button.js](.\WehelpStage2\function\common\nav_button.js)
    - [panel.js](.\WehelpStage2\function\common\panel.js)
    - [server.js](.\WehelpStage2\function\common\server.js)
    - [token.js](.\WehelpStage2\function\common\token.js)
  - [index/](.\WehelpStage2\function\index)
    - [fetch.js](.\WehelpStage2\function\index\fetch.js)
    - [search.js](.\WehelpStage2\function\index\search.js)
  - [thankyou/](.\WehelpStage2\function\thankyou)
    - [fetch.js](.\WehelpStage2\function\thankyou\fetch.js)
  - [attraction.js](.\WehelpStage2\function\attraction.js)
  - [booking.js](.\WehelpStage2\function\booking.js)
  - [index.js](.\WehelpStage2\function\index.js)
  - [thankyou.js](.\WehelpStage2\function\thankyou.js)
- [source/](.\WehelpStage2\source)
  - [icon_close.png](.\WehelpStage2\source\icon_close.png)
  - [icon_delete.png](.\WehelpStage2\source\icon_delete.png)
  - [icon_search.png](.\WehelpStage2\source\icon_search.png)
  - [left_arrow.png](.\WehelpStage2\source\left arrow.png)
  - [right_arrow.png](.\WehelpStage2\source\right arrow.png)
  - [taipei_icon.png](.\WehelpStage2\source\taipei_icon.png)
  - [welcome.png](.\WehelpStage2\source\welcome.png)
- [static/](.\WehelpStage2\static)
  - [attraction.html](.\WehelpStage2\static\attraction.html)
  - [booking.html](.\WehelpStage2\static\booking.html)
  - [index.html](.\WehelpStage2\static\index.html)
  - [thankyou.html](.\WehelpStage2\static\thankyou.html)
- [style/](.\WehelpStage2\style)
  - [style.css](.\WehelpStage2\style\style.css)
- [.dockerignore](.\WehelpStage2\.dockerignore)
- [.gitignore](.\WehelpStage2\.gitignore)
- [compose.yaml](.\WehelpStage2\compose.yaml)
- [Dockerfile](.\WehelpStage2\Dockerfile)
- [README.Docker.md](.\WehelpStage2\README.Docker.md)
- [README.md](.\WehelpStage2\README.md)
- [requirements.txt](.\WehelpStage2\requirements.txt)

## Deployment

- The project is containerized using Docker and deployed on AWS EC2.
- The database is hosted on AWS RDS.

## Environment variables

Hidden .env file contains necessary credentials and configurations for AWS, MySQL, and TapPay.

## API Endpoints

[Swagger docs](https://taipeidaytrip.haohaoscreamandrun.online/docs)