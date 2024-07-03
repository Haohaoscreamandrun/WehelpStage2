import { server } from "./common/server.js";
import { tokenValidation } from "./common/token.js";
import { renderBooking } from "./booking/bookRender.js";
import { navbarButtons } from "./common/nav_button.js";
import { config, onUpdate, onSubmit } from "./booking/tappay.js";

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
    console.log(response)
    if (respond.ok){
      renderBooking(user, response)
      // tappay
      TPDirect.setupSDK(151734, 'app_9veB5VWRTfHKqTuloC4j32wfD9ERzCDGzl8JfEs6mChxraKzPdx8chncoUVK', 'sandbox')
      TPDirect.card.setup(config)
      TPDirect.card.onUpdate(onUpdate)
      let paymentForm = document.getElementById('paymentbar')
      paymentForm.addEventListener('submit', (event)=>{
        event.preventDefault()
        onSubmit(response)
      })
    }else if(response.error){
      window.location.href = `${server}/thankyou?orderNumber=${response.message}`
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
flow()