import { navbarButtons } from './common/nav_button.js'
import { tokenValidation } from './common/token.js'
import { server } from './common/server.js'
import { getOrders } from './thankyou/fetch.js'

async function flow(){
  
  // Handle navbar buttons
  navbarButtons()

  // validate token and render greeting 
  let user = await tokenValidation()
  if(user.data === null){
    window.location.href = server
  }
  
  try{
    let orderNumber = new URLSearchParams(window.location.search).get('orderNumber')
    let response = await getOrders(orderNumber)

    let imgContainer = document.querySelector('.thankyoubar--trip--img')
    let imgTitle = document.querySelector('.thankyoubar--trip--img--name')
    let contactName = document.getElementById('contact-name')
    let contactEmail = document.getElementById('contact-email')
    let contactPhone = document.getElementById('contact-phone')
    let tripDate = document.getElementById('trip-date')
    let tripTime = document.getElementById('trip-time')
    let tripAddress = document.getElementById('trip-address')

    imgContainer.style.backgroundImage = `url(${response.data.trip.attraction.image})`
    imgTitle.innerText = response.data.trip.attraction.name
    contactName.innerText = response.data.contact.name
    contactEmail.innerText = response.data.contact.email
    contactPhone.innerText = response.data.contact.phone
    tripDate.innerText = response.data.trip.date
    tripTime.innerText = response.data.trip.time
    tripAddress.innerText = response.data.trip.attraction.address

  }catch(error) {
    console.error('Error fetching data:', error);
  }
}

flow()