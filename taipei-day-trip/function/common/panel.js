import {signUpValidation, signInValidation} from "./member.js"
import { tokenValidation } from "./token.js"
import { server } from "./server.js"

// open login panel function
export function openLoginPanel(){
  let background = document.querySelector(".popupbackground")
  let popUp = document.querySelector(".popupbar")
  let popUpForm = document.querySelector(".popupbar--popup--form")
  background.style.display = 'block'
  popUp.classList.toggle("showing")
  if (popUpForm.id === "signin"){
    popUpForm.onsubmit = signInValidation
  } else if (popUpForm.id === "signup"){
    popUpForm.onsubmit = signUpValidation
  } 
}

// close login panel function
export function closeLoginPanel(){
  let background = document.querySelector(".popupbackground")
  let popUp = document.querySelector(".popupbar")
  let updateMessage = document.querySelector(".popupbar--popup--form--warning")
  background.style.display = 'none'
  popUp.classList.toggle("showing")
  updateMessage.innerText = ""
}

// switch signin/signup panel function
export function switchSignInUpPanel(){
  let popUp = document.querySelector(".popupbar")
  popUp.classList.toggle("showing")
  let warningMessage = document.querySelector(".popupbar--popup--form--warning")
    if (warningMessage.innerText !== ""){
      warningMessage.innerText = ""
    }
  setTimeout(() => {

    let popUpForm = document.querySelector(".popupbar--popup--form")
    let popUpTitle = document.querySelector(".popupbar--popup--form--title")
    let inputEmail = document.querySelector("#popupbar--popup--form--email")
    let submitBtn = document.querySelector(".popupbar--popup--form--submit")
    let switchButton = document.querySelector(".popupbar--popup--form--switch")
    
    if (popUpForm.id === "signin"){
      popUpTitle.innerText = "註冊會員帳號"
      let inputName = document.createElement('input')
      inputName.type = "text"
      inputName.name = "inputName"
      inputName.id = "popupbar--popup--form--name"
      inputName.placeholder = "輸入姓名"
      inputName.classList.add("popupbar--popup--form--input")
      popUpForm.insertBefore(inputName, inputEmail)
      submitBtn.value = "註冊新帳戶"
      switchButton.innerText = "已經有帳戶了?點此登入"
      popUpForm.id = "signup"
      popUpForm.onsubmit = signUpValidation
    } else if (popUpForm.id === "signup"){
      popUpTitle.innerText = "登入會員帳號"
      let inputName = document.querySelector("#popupbar--popup--form--name")
      popUpForm.removeChild(inputName)
      submitBtn.value = "登入帳戶"
      switchButton.innerText = "還沒有帳戶?點此註冊"
      popUpForm.id = "signin"
      popUpForm.onsubmit = signInValidation
    } 
    popUpForm.reset()
    popUp.classList.toggle("showing")

  }, 300)
}

export async function openBookingPanel(){
  let signStatus = await tokenValidation()
  
  if (signStatus['data'] === null){
    openLoginPanel()
  } else {
    window.location.href = `${server}/booking`
  }
}