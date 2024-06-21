import { server } from "./server.js"
import { signOut } from "./member.js"
import { openLoginPanel } from "./panel.js"

// token validation function
export async function tokenValidation(){
  let token = localStorage.getItem('token') || null
  let headerContent = {}
  if (token === null){
    console.log("token not exsit.")
    headerContent = {
      'Content-Type': 'application/json'
    }
  } else {
    console.log("token is: ", token)
    headerContent = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  let loginButton = document.querySelector("#navbar--navcontainer--login")

  let response = await fetch(
    server + "/api/user/auth", 
    {
      method: "GET",
      headers: new Headers(headerContent)
    }
  )
  response = await response.json()
  
  if (!response.data){
    loginButton.innerText = "登入/註冊"
    loginButton.removeEventListener("click", signOut)
    loginButton.addEventListener("click", openLoginPanel)
  }else{
    loginButton.innerText = "登出系統"
    loginButton.removeEventListener("click", openLoginPanel)
    loginButton.addEventListener("click", signOut)
  }
}