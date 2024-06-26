import { server } from "./common/server.js";
import { tokenValidation } from "./common/token.js";

async function flow(){

  let user = await tokenValidation()
  let greetingTitle = document.querySelector('.reservebar--greeting')
  greetingTitle.innerText = `您好，${user.data.name}，待預定的行程如下`

  let getBookingURL = server + '/api/booking'
  let token = localStorage.getItem('token')
  try{
      let respond = await fetch(getBookingURL, {
      method : "GET",
      headers: new Headers({
        "Content-Type": 'application/json',
        'Authorization': `Bearer ${token}`
      })
    })
    if (!respond.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let response = await respond.json()
    response = JSON.parse(response)
    
    let attractionImage = document.querySelector(".reservebar--bookinginfo--img")
    let bookingTitle = document.querySelector(".reservebar--bookinginfo--details--titlerow--title")
    let bookingDate = document.querySelector('#reservebar--bookinginfo--details--contentrow--date')
    let bookingTime = document.querySelector('#reservebar--bookinginfo--details--contentrow--time')
    let bookingPrice = document.querySelector('#reservebar--bookinginfo--details--contentrow--price')
    let bookingAddress = document.querySelector('#reservebar--bookinginfo--details--contentrow--address')
    let nameInput = document.querySelector("#credentialbar--form--content--nameinput")
    let emailInput = document.querySelector("#credentialbar--form--content--mailinput")
    let totalPrice = document.querySelector(".submitbar--totalprice")
    attractionImage.style.backgroundImage = `url(${response.data.attraction.image})`
    bookingTitle.innerText = `台北一日遊：${response.data.attraction.name}`
    bookingDate.innerText = response.data.date
    bookingTime.innerText = response.data.time
    bookingPrice.innerText = `新台幣 ${response.data.price} 元`
    bookingAddress.innerText = response.data.attraction.address
    nameInput.value = user.data.name
    emailInput.value = user.data.email
    totalPrice.innerText = `總價：新台幣 ${response.data.price} 元`

  } catch (error) {
  console.error('Error fetching data:', error);
}


}

flow()