import {fetchScrollBar, fetchGrid, observer} from './common/fetch.js'
import {submitForm, clickSearch, scrollClick} from './common/search.js'
import {openLoginPanel,closeLoginPanel,switchSignInUpPanel} from './common/panel.js'
import {tokenValidation} from './common/token.js'

function mainFlow(){
  // fetch scrollbar and grid
  fetchScrollBar()
  fetchGrid(0, "" ,false)

  // scroll bar illustrate
  let scrollUpBtn = document.querySelector(".scrollbar--scrollup--btn")
  let scrollDownBtn = document.querySelector(".scrollbar--scrolldown--btn")
  scrollUpBtn.addEventListener("click",() => scrollClick(-1))
  scrollDownBtn.addEventListener("click",() => scrollClick(+1))

  // observe footer to fetch grid
  let targetElement = document.querySelector('.footerbar')
  observer.observe(targetElement)

  // add eventlistener on query form
  let form = document.querySelector(".searchbar--container--searchform")
  form.addEventListener("submit", submitForm)

  // add eventlistener on mrt scrollbar
  let scrollWindow = document.querySelector('.scrollbar--attractions')
  scrollWindow.addEventListener("click", clickSearch)

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

// mainflow

mainFlow()