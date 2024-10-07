import { server } from "./server.js";

// front end validation
// Username Criteria: Only alphanumeric characters (a-z, A-Z, 0-9), with a length of 1 to 30 characters.
let patternName = /^[a-zA-Z0-9]{3,30}$/;

// Password Criteria: At least one uppercase letter (A-Z), one lowercase letter (a-z), one digit (0-9), and a total length of 1 to 20 characters.
let patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;

// Submit registration form function
export async function signUpValidation(event) {
  event.preventDefault();
  console.log("Submit to Sign UP!");
  let email = document.querySelector("#popupbar--popup--form--email");
  let password = document.querySelector("#popupbar--popup--form--password");
  let name = document.forms["signup"]["inputName"];

  if (!patternName.test(name.value)) {
    name.value = "";
    name.placeholder = "3-30字內英數字寫組成";
    return;
  } else if (!patternPassword.test(password.value)) {
    password.value = "";
    password.placeholder = "8-20字內英數大小寫至少各一位";
    return;
  }
  // construct json object
  let request = {
    name: name.value,
    email: email.value,
    password: password.value,
  };
  request = JSON.stringify(request);
  // post to api
  try {
    let response = await fetch(server + "/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: request,
    });
    let updateMessage = document.querySelector(
      ".popupbar--popup--form--warning"
    );
    if (response.error) {
      updateMessage.innerText = response.message;
    } else if (response.ok) {
      updateMessage.innerText = "註冊成功，請再次登入";
    }
  } catch (error) {
    console.error(error);
  }
}

// Submit signin form function
export async function signInValidation(event) {
  event.preventDefault();
  console.log("Submit to Sign IN!");
  let email = document.querySelector("#popupbar--popup--form--email");
  let password = document.querySelector("#popupbar--popup--form--password");
  let popUpForm = document.querySelector(".popupbar--popup--form");

  if (!patternPassword.test(password.value)) {
    password.value = "";
    password.placeholder = "8-20字內英數大小寫至少各一位";
    return;
  }
  let request = {
    email: email.value,
    password: password.value,
  };
  request = JSON.stringify(request);
  try {
    let response = await fetch(server + "/api/user/auth", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: request,
    });
    response = await response.json();
    let updateMessage = document.querySelector(
      ".popupbar--popup--form--warning"
    );
    if (response.error) {
      // Cond1: Wrong credentials
      console.log("Wrong credentials!");
      updateMessage.innerText = response.message;
      popUpForm.reset();
    } else {
      // Cond2: Success, store token to localStorage
      console.log("Login successful!");
      for (let [key, value] of Object.entries(response)) {
        localStorage.setItem(key, value);
      }
      // Refresh page
      location.reload();
    }
  } catch (error) {
    console.error(error);
  }
}

// Sign out function
export function signOut() {
  // Remove token from localStorage
  localStorage.removeItem("token");
  // Refresh page
  location.reload();
}
