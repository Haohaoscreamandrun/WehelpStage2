import { server } from "./common/server.js";
import { tokenValidation } from "./common/token.js";
import { renderBooking } from "./booking/bookRender.js";
import { navbarButtons } from "./common/nav_button.js";

async function flow(){

  // Handle navbar buttons
  navbarButtons()

  // validate token and render greeting 
  let user = await tokenValidation()
  if(user.data === null){
    window.location.href = server
  }

  let greetingTitle = document.querySelector('.reservebar--greeting')
  greetingTitle.innerText = `您好，${user.data.name}，待預定的行程如下：`

  // fetch booking table and render the rest
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
    let response = await respond.json()
    response = JSON.parse(response)

    renderBooking(user, response)
    
    } catch (error) {
    console.error('Error fetching data:', error);
  }

  
}
flow()