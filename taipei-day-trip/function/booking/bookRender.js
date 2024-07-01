import { deleteBooking } from "./bookDelete.js"

export function renderBooking(user,response){
  if (response.data == null) {
      let reserveBar = document.querySelector(".reservebar--bookinginfo")
      let credentialBars = document.querySelectorAll(".credentialbar")
      let submitBar = document.querySelector(".submitbar")
      let seperationBars = document.querySelectorAll(".shrink--onphone")
      reserveBar.innerHTML = `<div class="reservebar--bookinginfo--details--contentrow--conttent">目前沒有任何待預訂的行程</div>`
      credentialBars.forEach(credentialBar => {
        credentialBar.style.display = 'none'
      })
      seperationBars.forEach(seperationBar => {
        seperationBar.style.display = 'none'
      })
      submitBar.innerHTML = ""
    }else{
    
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
      
      // add listener on delete button
      let deleteButton = document.querySelector(".reservebar--bookinginfo--details--titlerow--delete")
      deleteButton.addEventListener("click", deleteBooking)

      }
}