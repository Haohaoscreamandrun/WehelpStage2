import {fetchAttraction, preloadImages} from './attraction/fetch.js'
import {pagination, turnPage} from './attraction/pagination.js'
import {changeBookingPrice} from './attraction/price.js'
import {openLoginPanel,closeLoginPanel,switchSignInUpPanel} from './common/panel.js'
import {tokenValidation} from './common/token.js'

// Get the current url
let url = window.location.href

// Get the id in url
let urlParts = url.split('/')
let attractionID = urlParts[urlParts.length - 1]

async function flow(){
  let imgsURL = await fetchAttraction(attractionID)
  let preloadImgList = await preloadImages(imgsURL)

  let lastImageBtn = document.querySelector(".bookingbar--imgcontainer--lastbtn")
  let nextImageBtn = document.querySelector(".bookingbar--imgcontainer--nextbtn")
  lastImageBtn.addEventListener("click", () => pagination(-1, preloadImgList))
  nextImageBtn.addEventListener("click", () => pagination(+1, preloadImgList))

  let paginationMark = document.querySelector(".bookingbar--imgcontainer--pagination")
  paginationMark.addEventListener('click', (event) => turnPage(event, preloadImgList))

  let bookingTimeRadio = document.querySelectorAll('input[name="bookingTime"]')
  bookingTimeRadio.forEach((button)=>{
    button.addEventListener("change", changeBookingPrice)
  })

  let homePage = document.querySelector(".navbar--title")
  homePage.addEventListener('click', function(){
    window.location.href = `${urlParts.slice(0,3).join("/")}`
  })

  // Click to open login panel
  let loginButton = document.querySelector("#navbar--navcontainer--login")
  loginButton.addEventListener('click', openLoginPanel)
  // Click to close login panel
  let closeLoginButton = document.querySelector(".popupbar--popup--closebtn")
  closeLoginButton.addEventListener("click", closeLoginPanel)

  // Switching between Sign-in and sign-up
  let switchButton = document.querySelector(".popupbar--popup--form--switch")
  switchButton.addEventListener('click', switchSignInUpPanel)

  // Check token
  tokenValidation()
}

flow()