import { server } from "../common/server.js";
// fetch for attraction detail
export async function fetchAttraction(attractionID) {
  // fetch
  let attractionURL = `${server}/api/attraction/${attractionID}`;

  let response = await fetch(attractionURL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  try {
    let jsonObj = await response.json();
    let jsonList = jsonObj["data"];
    // declare
    let imgContainer = document.querySelector(".bookingbar--imgcontainer");
    let attractionTitle = document.querySelector(
      ".bookingbar--bookingpanel--title"
    );
    let attractionType = document.querySelector(
      ".bookingbar--bookingpanel--type"
    );
    let attractionDescription = document.querySelector(
      ".detailbar--description"
    );
    let attractionAddress = document.querySelector(
      ".detailbar--addressdiv--address"
    );
    let attractionTransport = document.querySelector(
      ".detailbar--transportdiv--transportation"
    );
    let paginationMark = document.querySelector(
      ".bookingbar--imgcontainer--pagination"
    );

    // assign value
    imgContainer.style.backgroundImage = `url(${jsonList["images"][0]})`;
    attractionTitle.innerText = jsonList["name"];
    attractionType.innerText = `${jsonList["category"]} at ${jsonList["mrt"]}`;
    attractionDescription.innerText = jsonList["description"];
    attractionAddress.innerText = jsonList["address"];
    attractionTransport.innerText = jsonList["transport"];

    // create pagination
    for (let i = 0; i < jsonList["images"].length; i++) {
      let circleDiv = document.createElement("div");
      circleDiv.classList.add("bookingbar--imgcontainer--pagination--pages");
      if (i === 0) {
        circleDiv.classList.add("page--checked");
      }
      circleDiv.id = `pages__${i}`;
      paginationMark.appendChild(circleDiv);
    }

    // return list for later use
    return jsonList["images"];
  } catch (error) {
    console.error(error);
  }
}

// pre-load img
export async function preloadImages(imgsURL) {
  let preloadImgList = [];
  imgsURL.forEach((url) => {
    let img = new Image();
    img.src = url;
    preloadImgList.push(img);
  });
  return preloadImgList;
}
