import {fetchAttraction, preloadImages} from './attraction/fetch.js'
import {pagination, turnPage} from './attraction/pagination.js'
import {changeBookingPrice} from './attraction/price.js'
import {tokenValidation} from './common/token.js'
import { navbarButtons } from './common/nav_button.js'
import { submitBooking,setMinDate } from './attraction/bookSubmit.js'

async function flow(){
  // Get the current url
  let url = window.location.href

  // Get the id in url
  let urlParts = url.split('/')
  let attractionID = urlParts[urlParts.length - 1]
  let imgsURL = await fetchAttraction(attractionID)
  let preloadImgList = await preloadImages(imgsURL)
  // photo gallery
  let lastImageBtn = document.querySelector(".bookingbar--imgcontainer--lastbtn")
  let nextImageBtn = document.querySelector(".bookingbar--imgcontainer--nextbtn")
  lastImageBtn.addEventListener("click", () => pagination(-1, preloadImgList))
  nextImageBtn.addEventListener("click", () => pagination(+1, preloadImgList))
  let paginationMark = document.querySelector(".bookingbar--imgcontainer--pagination")
  paginationMark.addEventListener('click', (event) => turnPage(event, preloadImgList))
  // change display price according to radio
  let bookingTimeRadio = document.querySelectorAll('input[name="bookingTime"]')
  bookingTimeRadio.forEach((button)=>{
    button.addEventListener("change", changeBookingPrice)
  })
  // handle booking btn
  let bookingSubmit = document.querySelector(".bookingbar--bookingpanel--bookingform--submit")
  bookingSubmit.addEventListener('click', submitBooking)
  // set min date on dateinput
  let dateInput = document.querySelector("#bookingbar--bookingpanel--bookingform--date--dateinput")
  dateInput.addEventListener('click', ()=>{
    dateInput.setAttribute('min', setMinDate())
  })
  
  // Handle navbar buttons
  navbarButtons()

  // Check token
  tokenValidation()
}

flow()


