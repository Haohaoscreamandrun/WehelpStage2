// Get the current domain
let currentDomain = window.location.hostname;

// Get the current port
let currentPort = window.location.port;

// Combine domain and port
let server = `http://${currentDomain}:${currentPort}`;
let currentKeyword = ''

async function fetchScrollBar(){
  try{
    let response = await fetch(server+"/api/mrts")
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let scrollList = await response.json()
    let scrollbar = document.querySelector('.scrollbar--attractions')
    for (let i = 0; i < scrollList['data'].length; i++){
      let newDiv = document.createElement('div')
      newDiv.classList.add('scrollbar--attractions--list')
      newDiv.innerText = scrollList['data'][i]
      scrollbar.appendChild(newDiv)
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

async function fetchGrid(page=0, keyword='', reload=false){
  let gridBar = document.querySelector('.gridbar')
  currentKeyword = keyword
  
  if(reload === true){
    gridBar.innerHTML = ""
    console.log("clear all content!")
  }
  
  let response = await fetch(server + `/api/attractions?page=${page}&keyword=${keyword}`)
  let gridAttraction = await response.json()
  
  if (!response.ok) {
    let input = document.querySelector('.searchbar--container--searchform--input')
    input.value = ''
    input.setAttribute('placeholder' ,gridAttraction['message'])
  }else{
  nextPage = gridAttraction['nextPage']
  for (let i = 0; i < gridAttraction['data'].length; i++){
    //create div
    let [gridItem, imgContainer, imgName, detailContainer, detailMRT, detailType] = Array.from({length: 6}, () => document.createElement("div"));
    // assign class
    gridItem.classList.add('gridbar--item')
    imgContainer.classList.add('gridbar--item--imgcontainer');
    imgName.classList.add('gridbar--item--imgcontainer--name');
    detailContainer.classList.add('gridbar--item--detailcontainer');
    detailMRT.classList.add('gridbar--item--detailcontainer--mrt')
    detailType.classList.add('gridbar--item--detailcontainer--type')
    // assign value
    let currentAttraction = gridAttraction['data'][i]
    imgContainer.style.backgroundImage = `url(${currentAttraction['images'][0]})`
    imgName.innerText = currentAttraction['name']
    detailMRT.innerText = currentAttraction['mrt']
    detailType.innerText = currentAttraction['category']
    // add listener
    gridItem.addEventListener('click', function(){
      window.location.href = `${server}/attraction/${currentAttraction['id']}`
    })
    // construct
    imgContainer.appendChild(imgName)
    detailContainer.appendChild(detailMRT)
    detailContainer.appendChild(detailType)
    gridItem.appendChild(imgContainer)
    gridItem.appendChild(detailContainer)
    gridBar.appendChild(gridItem)
  }
}
}
let scrollUpBtn = document.querySelector(".scrollbar--scrollup--btn")
let scrollWindow = document.querySelector('.scrollbar--attractions')
let scrollDownBtn = document.querySelector(".scrollbar--scrolldown--btn")
let smallestDisplayChild = 0
let scrollAmount = 0;
function scrollClick(direction){
  let scrollStep = 20;
  let slideTimer = setInterval(()=>{
    scrollWindow.scrollLeft += direction * scrollStep
    scrollAmount += direction * scrollStep;
    let isReachRightEnd = scrollWindow.scrollLeft === scrollWindow.scrollWidth-scrollWindow.offsetWidth
    let isReachLeftEnd = scrollWindow.scrollLeft === 0
    if (Math.abs(scrollAmount) === 200){
      scrollAmount = 0
      clearInterval(slideTimer)
    }else if(isReachRightEnd || isReachLeftEnd){
      scrollAmount = 0
      clearInterval(slideTimer)
    }
  },15)
  
}

scrollUpBtn.addEventListener("click",() => scrollClick(-1))
scrollDownBtn.addEventListener("click",() => scrollClick(+1))


fetchScrollBar()
let nextPage = 0

// Intersection API
let options = {
  root: null,
  rootMargin:"0px",
  threshold: 0.05,
}

let handleInetersect = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && nextPage !== null){
      console.log("fetch another page")
      fetchGrid(nextPage,currentKeyword,reload=false)
    }else if(nextPage === null){
      console.log("NO other pages")
    }
  });
}

let observer = new IntersectionObserver(handleInetersect, options)

let targetElement = document.querySelector('.footerbar')

if (targetElement){
  observer.observe(targetElement)
}

// Query function
let form = document.querySelector(".searchbar--container--searchform")
let input = document.querySelector('.searchbar--container--searchform--input')

function submitForm(e){
  e.preventDefault();
  let queryString = input.value
  fetchGrid(page = 0,keyword = String(queryString),reload = true)
}

form.addEventListener("submit", submitForm)

// click to search

scrollWindow.addEventListener("click",(event)=>{
    let targetClass = event.target.classList[0]
    if (targetClass === 'scrollbar--attractions--list'){
      let queryString = event.target.innerText;
      input.value = queryString
      submitForm(event)
    }
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

// Submit registration form
async function signUpValidation(event){
  event.preventDefault()
  console.log("Submit to Sign UP!")
  let email = document.querySelector("#popupbar--popup--form--email")
  let password = document.querySelector("#popupbar--popup--form--password")
  let name = document.forms["signup"]["inputName"]

  // front end validation
  // Username Criteria: Only alphanumeric characters (a-z, A-Z, 0-9), with a length of 1 to 30 characters.
  let patternName = /^[a-zA-Z0-9]{3,30}$/ 
 
  // Password Criteria: At least one uppercase letter (A-Z), one lowercase letter (a-z), one digit (0-9), and a total length of 1 to 20 characters.
  let patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/

  if(!patternName.test(name.value)){
    name.value = ""
    name.placeholder = "3-30字內英數字寫組成"
    return;
  }else if(!patternPassword.test(password.value)){
    password.value = ""
    password.placeholder = "8-20字內英數大小寫至少各一位"
    return;
  }
  // construct json object
  let request = {
    "name": name.value,
    "email": email.value,
    "password": password.value
  }
  request = JSON.stringify(request)
  // post to api
  try{
    let response = await fetch(server + "/api/user", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: request
    })
    response = await response.json()
    let updateMessage = document.querySelector(".popupbar--popup--form--warning")
    if (response.error) {
      updateMessage.innerText = response.message
    } else if (response["ok"]){
      updateMessage.innerText = "註冊成功，請再次登入"
    }

  }catch(error){
    console.error(error)
  }

  
}

// Submit signin form
async function signInValidation(event){
  event.preventDefault()
  console.log("Submit to Sign IN!")
  let email = document.querySelector("#popupbar--popup--form--email")
  let password = document.querySelector("#popupbar--popup--form--password")

  let patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/

  if(!patternPassword.test(password.value)){
    password.value = ""
    password.placeholder = "8-20字內英數大小寫至少各一位"
    return;
  }
  let request = {
    "email": email.value,
    "password": password.value
  }
  request = JSON.stringify(request)
  try{
    let response = await fetch(server + "/api/user/auth", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: request
    })
    response = await response.json()
    let updateMessage = document.querySelector(".popupbar--popup--form--warning")
    if (response.error) {
      // Cond1: Wrong credentials
      console.log("Wrong credentials!")
      updateMessage.innerText = response.message
      let popUpForm = document.querySelector(".popupbar--popup--form")
      popUpForm.reset()
    } else {
      // Cond2: Success, store token to localStorage
      console.log("Login successful!")
      for (let [key, value] of Object.entries(response)){
      localStorage.setItem(key, value)
      }
      // closeLoginPanel()
      tokenValidation()
    }    
        
  }catch(error){
    console.error(error)
  }
}

// token validation function
async function tokenValidation(){
  let token = localStorage.getItem('token')
  let response = await fetch(
    server + "/api/user/auth", 
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    }
  )
  response = await response.json()
  console.log(response)
}


// open login panel function
function openLoginPanel(){
  let background = document.querySelector(".popupbackground")
  let popUp = document.querySelector(".popupbar")
  background.style.display = 'block'
  popUp.classList.toggle("showing")
}

// close login panel function
function closeLoginPanel(){
  let background = document.querySelector(".popupbackground")
  let popUp = document.querySelector(".popupbar")
  background.style.display = 'none'
  popUp.classList.toggle("showing")
  let updateMessage = document.querySelector(".popupbar--popup--form--warning")
  updateMessage.innerText = ""
}

// switch signin/signup panel function
function switchSignInUpPanel(){
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