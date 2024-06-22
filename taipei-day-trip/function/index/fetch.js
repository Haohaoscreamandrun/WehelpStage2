import { server } from "../common/server.js"

export async function fetchScrollBar(){
  console.log("fetchScrollBar in use.")
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

let currentKeyword = ''
let nextPage = 0

export async function fetchGrid(page=0, keyword='', reload=false){
  let gridBar = document.querySelector('.gridbar')
  let input = document.querySelector('.searchbar--container--searchform--input')
  
  if(reload === true){
    gridBar.innerHTML = ""
    console.log("clear all content!")
    nextPage = 0
  }
  
  let response = await fetch(server + `/api/attractions?page=${page}&keyword=${keyword}`)
  let gridAttraction = await response.json()
  
  if (!response.ok) {
    input.value = ''
    input.setAttribute('placeholder' ,gridAttraction['message'])
  }else{
    currentKeyword = keyword
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

// Intersection API
let options = {
  root: null,
  rootMargin:"0px",
  threshold: 0.05,
}


let handleInetersect = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && nextPage !== null && nextPage !== 0){
      fetchGrid(nextPage,currentKeyword,false)
    }else if(nextPage === null){
      console.log("NO other pages")
    }
  });
}

export let observer = new IntersectionObserver(handleInetersect, options)