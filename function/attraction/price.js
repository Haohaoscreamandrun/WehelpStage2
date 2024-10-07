// Change price based on time
export function changeBookingPrice(event) {
  let selected = event.target.value;
  let bookingPrice = document.querySelector(
    ".bookingbar--bookingpanel--bookingform--price--ntd"
  );
  if (selected === "上半天") {
    bookingPrice.innerText = "新台幣 2000 元";
  } else if (selected === "下半天") {
    bookingPrice.innerText = "新台幣 2500 元";
  }
}
