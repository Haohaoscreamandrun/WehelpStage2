import { fetchGrid } from "./fetch.js";

// Query function

export function submitForm(event) {
  event.preventDefault();
  let input = document.querySelector(
    ".searchbar--container--searchform--input"
  );
  let queryString = input.value;
  fetchGrid(0, String(queryString), true);
}

// click to search function
export function clickSearch(event) {
  let input = document.querySelector(
    ".searchbar--container--searchform--input"
  );
  let targetClass = event.target.classList[0];
  if (targetClass === "scrollbar--attractions--list") {
    let queryString = event.target.innerText;
    input.value = queryString;
    submitForm(event);
  }
}

let scrollAmount = 0;
export function scrollClick(direction) {
  let scrollWindow = document.querySelector(".scrollbar--attractions");
  let scrollStep = 20;
  let slideTimer = setInterval(() => {
    scrollWindow.scrollLeft += direction * scrollStep;
    scrollAmount += direction * scrollStep;
    let isReachRightEnd =
      scrollWindow.scrollLeft ===
      scrollWindow.scrollWidth - scrollWindow.offsetWidth;
    let isReachLeftEnd = scrollWindow.scrollLeft === 0;
    if (Math.abs(scrollAmount) === 200) {
      scrollAmount = 0;
      clearInterval(slideTimer);
    } else if (isReachRightEnd || isReachLeftEnd) {
      scrollAmount = 0;
      clearInterval(slideTimer);
    }
  }, 15);
}
