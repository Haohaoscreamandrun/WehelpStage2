import { server } from "../common/server.js";

let prime = "";

export let config = {
  fields: {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "後三碼",
    },
  },

  styles: {
    // Style all elements
    input: {
      color: "gray",
    },
    // Styling ccv field
    "input.ccv": {
      // 'font-size': '16px'
    },
    // Styling expiration-date field
    "input.expiration-date": {
      // 'font-size': '16px'
    },
    // Styling card-number field
    "input.card-number": {
      // 'font-size': '16px'
    },
    // style focus state
    ":focus": {
      // 'color': 'black'
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號 (未正確於每個裝置上顯示)
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 5,
    endIndex: 12,
  },
};

export function onUpdate(update) {
  // update.canGetPrime === true
  // --> you can call TPDirect.card.getPrime()
  // console.log(
  //     `
  //     cardType (String): ${update.cardType}
  //     canGetPrime (boolean): ${update.canGetPrime}
  //     hasError (boolean): ${update.hasError}
  //     status.number (int): ${update.status.number}
  //     status.expiry (int): ${update.status.expiry}
  //     status.ccv (int): ${update.status.ccv}
  //     `
  // )
  let submitButton = document.querySelector(".submitbar--submit");

  if (update.canGetPrime) {
    // Enable submit Button to get prime.
    submitButton.removeAttribute("disabled");
  } else {
    // Disable submit Button to get prime.
    submitButton.setAttribute("disabled", true);
  }

  // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
  if (update.cardType === "visa") {
    // Handle card type visa.
  }

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.number === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.expiry === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.expiry === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }

  if (update.status.ccv === 2) {
    // setNumberFormGroupToError()
  } else if (update.status.ccv === 0) {
    // setNumberFormGroupToSuccess()
  } else {
    // setNumberFormGroupToNormal()
  }
}

export function onSubmit(response) {
  // 取得 TapPay Fields 的 status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // 確認是否可以 getPrime
  if (tappayStatus.canGetPrime === false) {
    alert("can not get prime");
    return;
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert("get prime error " + result.msg);
      return;
    }
    // alert('get prime 成功，prime: ' + result.card.prime)
    prime = result.card.prime;
    // send prime to your server, to pay with Pay by Prime API .
    // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    fetchPostOrder(response);
  });
}

async function fetchPostOrder(response) {
  let nameInput = document.querySelector(
    "#credentialbar--form--content--nameinput"
  );
  let emailInput = document.querySelector(
    "#credentialbar--form--content--mailinput"
  );
  let phoneInput = document.getElementById(
    "credentialbar--form--content--phoneinput"
  );

  let requestBody = {
    prime: prime,
    order: {
      price: response.data.price,
      trip: {
        attraction: response.data.attraction,
        date: response.data.date,
        time: response.data.time,
      },
      contact: {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
      },
    },
  };
  // console.log(requestBody)
  let token = localStorage.getItem("token");
  let respond = await fetch(`${server}/api/orders`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify(requestBody),
  });
  let responseObj = await respond.json();
  console.log(respond.ok, responseObj.data.payment.status);
  if (respond.ok && responseObj.data.payment.status === 0) {
    //success payment
    window.location.href = `${server}/thankyou?orderNumber=${responseObj.data.number}`;
  } else if (respond.ok) {
    //unsuccess payment
    alert(`付款失敗：${responseObj.data.payment.message}`);
  } else if (responseObj.error) {
    //internet error
    alert(`伺服器錯誤：${responseObj.message}`);
  }
}
