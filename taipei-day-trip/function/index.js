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

// Click to login
let loginButton = document.querySelector("#navbar--navcontainer--login")
loginButton.addEventListener('click',()=>{
  let background = document.querySelector(".popupbackground")
  let popUp = document.querySelector(".popupbar")
  background.style.display = 'block'
  popUp.classList.toggle("showing")
})

// Click to close login panel
let closeLoginButton = document.querySelector(".popupbar--popup--closebtn")
closeLoginButton.addEventListener("click",()=>{
  let background = document.querySelector(".popupbackground")
  let popUp = document.querySelector(".popupbar")
  background.style.display = 'none'
  popUp.classList.toggle("showing")
})

// Switching between Sign-in and sign-up
let switchButton = document.querySelector(".popupbar--popup--form--switch")
switchButton.addEventListener('click', ()=>{
  
  let popUp = document.querySelector(".popupbar")
  popUp.classList.toggle("showing")
  
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
    } else if (popUpForm.id === "signup"){
      popUpTitle.innerText = "登入會員帳號"
      let inputName = document.querySelector("#popupbar--popup--form--name")
      popUpForm.removeChild(inputName)
      submitBtn.value = "登入帳戶"
      switchButton.innerText = "還沒有帳戶?點此註冊"
      popUpForm.id = "signin"
    }
    
    popUp.classList.toggle("showing")

  }, 300)
})

// Submit registration form
function signUpValidation(event){
  event.preventDefault()
  
}