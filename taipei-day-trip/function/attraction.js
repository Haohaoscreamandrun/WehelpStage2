let imgContainer = document.querySelector(".bookingbar--imgcontainer")
let lastImageBtn = document.querySelector(".bookingbar--imgcontainer--lastbtn")
let nextImageBtn = document.querySelector(".bookingbar--imgcontainer--nextbtn")
let attractionTitle = document.querySelector(".bookingbar--bookingpanel--title")
let attractionType = document.querySelector(".bookingbar--bookingpanel--type")
let bookingForm = document.querySelector(".bookingbar--bookingpanel--bookingform")
let bookingPrice = document.querySelector(".bookingbar--bookingpanel--bookingform--price--ntd")
let attractionDescription = document.querySelector(".detailbar--description")
let attractionAddress = document.querySelector(".detailbar--addressdiv--address")
let attractionTransport = document.querySelector(".detailbar--transportdiv--transportation")

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
}

fetchAttraction(attractionID)