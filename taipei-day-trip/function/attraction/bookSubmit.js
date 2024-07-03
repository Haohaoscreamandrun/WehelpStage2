import { server } from "../common/server.js"
import { tokenValidation } from "../common/token.js"
import { openLoginPanel } from "../common/panel.js"

export async function submitBooking(event){
  event.preventDefault()
  // get form data
  let bookingForm = document.querySelector(".bookingbar--bookingpanel--bookingform")
  let formData = new FormData(bookingForm)
  let bookingDate = formData.get('bookingDate')
  let bookingTime = formData.get('bookingTime')

  // check if logged in
  let signStatus = await tokenValidation()
  if (signStatus['data'] === null){
    openLoginPanel()
  } else if (new Date(setMinDate()) >= new Date(bookingDate)){
    alert("請選擇預約明天之後的日期。")
  }else{
    // get attraction ID
    let url = window.location.href
    let urlParts = url.split('/')
    let attractionID = urlParts[urlParts.length - 1]
    let bookingURL = `${server}/api/booking`

    // construct request
    let request = {
      'attractionId': parseInt(attractionID),
      'date': bookingDate,
    }
    if (bookingTime === "上半天"){
      request['time'] = 'Morning'
      request['price'] = 2000
    } else if (bookingTime === "下半天"){
      request['time'] = 'Afternoon'
      request['price'] = 2500
    }

    let token = localStorage.getItem('token')
    let respond = await fetch(bookingURL, {
      method : "POST",
      headers: new Headers({
        "Content-Type": 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      body: JSON.stringify(request)
    })
    let response = await respond.json()
    console.log(response)
    if (respond === null){
      console.log("Nothing returned.")
    }else if (response.error){
      alert(response.message)
    }else if(respond.ok){
      window.location.href = `${server}/booking`
    }
  }
}

export function setMinDate(){
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth()+1
  let yyyy = today.getFullYear()
  if (dd < 10) {
      dd = '0' + dd;
  }

  if (mm < 10) {
      mm = '0' + mm;
  }
  today =  yyyy + '-' + mm + '-' + dd;
  return today
}