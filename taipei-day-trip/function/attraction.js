let homePage = document.querySelector(".navbar--title")
let imgContainer = document.querySelector(".bookingbar--imgcontainer")
let lastImageBtn = document.querySelector(".bookingbar--imgcontainer--lastbtn")
let nextImageBtn = document.querySelector(".bookingbar--imgcontainer--nextbtn")
let paginationMark = document.querySelector(".bookingbar--imgcontainer--pagination")
let attractionTitle = document.querySelector(".bookingbar--bookingpanel--title")
let attractionType = document.querySelector(".bookingbar--bookingpanel--type")
let bookingForm = document.querySelector(".bookingbar--bookingpanel--bookingform")
let bookingTimeRadio = document.querySelectorAll('input[name="bookingTime"]')
let bookingDate = document.querySelector("#bookingbar--bookingpanel--bookingform--date--dateinput")
let bookingPrice = document.querySelector(".bookingbar--bookingpanel--bookingform--price--ntd")
let attractionDescription = document.querySelector(".detailbar--description")
let attractionAddress = document.querySelector(".detailbar--addressdiv--address")
let attractionTransport = document.querySelector(".detailbar--transportdiv--transportation")
let imgsURL = [];
let preloadImgList = [];
let pageCount = 0;

// Get the current url
let url = window.location.href

// Get the id in url
let urlParts = url.split('/')
let attractionID = urlParts[urlParts.length - 1]

// fetch for attraction detail
async function fetchAttraction(attractionID){
  let attractionURL = `${urlParts.slice(0,3).join("/")}/api/attraction/${attractionID}`
  let response = await fetch(attractionURL)
  if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  let jsonObj = await response.json()
  let jsonList = jsonObj['data']
  // assign value
  imgContainer.style.backgroundImage = `url(${jsonList['images'][0]})`
  attractionTitle.innerText = jsonList['name']
  attractionType.innerText = `${jsonList['category']} at ${jsonList['mrt']}`
  attractionDescription.innerText = jsonList['description']
  attractionAddress.innerText = jsonList['address']
  attractionTransport.innerText = jsonList['transport']

  // create pagination
  for (let i = 0; i < jsonList['images'].length; i++){
    let circleDiv = document.createElement('div')
    circleDiv.classList.add("bookingbar--imgcontainer--pagination--pages")
    if (i === 0){circleDiv.classList.add("page--checked")}
    circleDiv.id = `pages__${i}`
    paginationMark.appendChild(circleDiv)
  }

  // return list for later use
  imgsURL = jsonList['images']
}

// pre-load img
async function preloadImages(imgsURL){
  await imgsURL.forEach(url => {
    let img = new Image();
    img.src = url
    preloadImgList.push(img)
  })
}

// pagination btn
function pagination(direction) {
  //clear dots
  let lastDot = document.getElementById(`pages__${pageCount}`)
  lastDot.classList.toggle("page--checked")

  pageCount += direction
  if (pageCount < 0){
    pageCount = preloadImgList.length + direction
  }else if (pageCount >= preloadImgList.length){
    pageCount = pageCount - preloadImgList.length
  }
  // load picture
  
  imgContainer.style.backgroundImage = `url(${preloadImgList[pageCount].src})` //Won't fetch url again since already preloaded

  // add class to dots
  let currentDot = document.getElementById(`pages__${pageCount}`)
  currentDot.classList.toggle("page--checked")
}

paginationMark.addEventListener('click',(event)=>{
  if(event.target.classList.value === "bookingbar--imgcontainer--pagination--pages"){
    let targetID = event.target.id
    let jumpPage = targetID.split("__")[1]
    pagination(parseInt(jumpPage)-pageCount)
  }
})

async function flow(){
  await fetchAttraction(attractionID)
  await preloadImages(imgsURL)
  lastImageBtn.addEventListener("click", () => pagination(-1))
  nextImageBtn.addEventListener("click", () => pagination(+1))
}

flow()

// Change price based on time
function changeBookingPrice(event){
  let selected = event.target.value
  if (selected === '上半天'){
    bookingPrice.innerText = '新台幣 2000 元'
  }else if (selected === '下半天'){
    bookingPrice.innerText = '新台幣 2500 元'
  }
}

bookingTimeRadio.forEach((button)=>{
  button.addEventListener("change", changeBookingPrice) //called immediately when addEventListener is executed 
})

homePage.addEventListener('click', function(){
    window.location.href = `${urlParts.slice(0,3).join("/")}`
  })