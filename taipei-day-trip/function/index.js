
// Get the current domain
let currentDomain = window.location.hostname;

// Get the current port
let currentPort = window.location.port;

// Combine domain and port
let server = `http://${currentDomain}:${currentPort}`;
console.log(server)
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
    imgContainer.style.backgroundImage = `url(${gridAttraction['data'][i]['images'][1]})`
    imgName.innerText = gridAttraction['data'][i]['name']
    detailMRT.innerText = gridAttraction['data'][i]['mrt']
    detailType.innerText = gridAttraction['data'][i]['category']
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

function scrollToggle(nth){
  let element = document.querySelector(`.scrollbar--attractions--list:nth-child(${nth+1})`)
  element.classList.toggle("hide");
}

function scrollClick(number){
  for (let i = 0 ; i < Math.abs(number); i++){
    if (number < 0 && smallestDisplayChild !== 0){
      smallestDisplayChild -= 1
      scrollToggle(smallestDisplayChild)
    }else if((number > 0 && scrollWindow.scrollWidth > scrollWindow.clientWidth)){
      scrollToggle(smallestDisplayChild)
      smallestDisplayChild += 1
    }
  }
}

// function moveChildrenLeft(){
//   if (scrollWindow){
//     let children = scrollWindow.children;
//     for (let i = 0; i < children.length; i++) {
//       let child = children[i];
//       child.style.transition = 'transform 0.5s ease';
//       child.style.transform = 'translateX(-10%)';
//   }
// }}

// function moveChildrenRight(){
//   if (scrollWindow){
//     let children = scrollWindow.children;
//     for (let i = 0; i < children.length; i++) {
//       let child = children[i];
//       child.style.transition = 'transform 0.5s ease';
//       child.style.transform = 'translateX(10%)';
//   }
// }}

let scrollUpBtn = document.querySelector(".scrollbar--scrollup--btn")
let scrollWindow = document.querySelector('.scrollbar--attractions')
let scrollDownBtn = document.querySelector(".scrollbar--scrolldown--btn")
let smallestDisplayChild = 0

scrollUpBtn.addEventListener("click",() => scrollClick(-3))
scrollDownBtn.addEventListener("click",() => scrollClick(+3))
// scrollUpBtn.addEventListener("click",() => moveChildrenLeft())
// scrollDownBtn.addEventListener("click",() => moveChildrenRight())

fetchScrollBar()
let nextPage = 0
// fetchGrid()

//window.innerHeight: This is the height of the visible content. 視窗的長度

// document.body.scrollHeight: This is the total height of the entire content, including both the visible and hidden parts.

// window.scrollY: Indicates the position that the user has scrolled to. 往下捲了多少
// document.addEventListener("scroll", ()=>{
//   let isReachBottom = document.body.scrollHeight - 50 <= (window.scrollY + window.innerHeight)
//   if (isReachBottom && nextPage != null) {
//     fetchGrid(nextPage)
//   }
// })


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
    let queryString = event.target.innerText;
    input.value = queryString
    submitForm(event)
  })

