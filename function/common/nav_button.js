import {
  openLoginPanel,
  closeLoginPanel,
  switchSignInUpPanel,
  openBookingPanel,
} from "./panel.js";
import { server } from "./server.js";

export function navbarButtons() {
  // Go back to homepage
  let homePage = document.querySelector(".navbar--title");
  homePage.addEventListener("click", function () {
    window.location.href = server;
  });

  // Direct to booking
  let bookingPage = document.querySelector("#navbar--navcontainer--booking");
  bookingPage.addEventListener("click", openBookingPanel);

  // Click to open login panel
  let loginButton = document.querySelector("#navbar--navcontainer--login");
  loginButton.addEventListener("click", openLoginPanel);
  // Click to close login panel
  let closeLoginButton = document.querySelector(".popupbar--popup--closebtn");
  closeLoginButton.addEventListener("click", closeLoginPanel);

  // Switching between Sign-in and sign-up
  let switchButton = document.querySelector(".popupbar--popup--form--switch");
  switchButton.addEventListener("click", switchSignInUpPanel);
}
