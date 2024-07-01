import {fetchScrollBar, fetchGrid, observer} from './index/fetch.js'
import {submitForm, clickSearch, scrollClick} from './index/search.js'
import {tokenValidation} from './common/token.js'
import { navbarButtons } from './common/nav_button.js'

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

  // Handle navbar buttons
  navbarButtons()

  // Check token
  tokenValidation()
}

// mainflow

mainFlow()