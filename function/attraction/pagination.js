let pageCount = 0;

// pagination btn
export function pagination(direction, imgList) {
  //clear dots
  let lastDot = document.getElementById(`pages__${pageCount}`);
  lastDot.classList.toggle("page--checked");

  pageCount += direction;
  if (pageCount < 0) {
    pageCount = imgList.length + direction;
  } else if (pageCount >= imgList.length) {
    pageCount = pageCount - imgList.length;
  }
  // load picture
  let imgContainer = document.querySelector(".bookingbar--imgcontainer");
  imgContainer.style.backgroundImage = `url(${imgList[pageCount].src})`; //Won't fetch url again since already preloaded

  // add class to dots
  let currentDot = document.getElementById(`pages__${pageCount}`);
  currentDot.classList.toggle("page--checked");
}

export function turnPage(event, imgList) {
  if (
    event.target.classList.value ===
    "bookingbar--imgcontainer--pagination--pages"
  ) {
    let targetID = event.target.id;
    let jumpPage = targetID.split("__")[1];
    pagination(parseInt(jumpPage) - pageCount, imgList);
  }
}
