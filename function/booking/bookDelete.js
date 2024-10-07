import { server } from "../common/server.js";

export async function deleteBooking() {
  let getBookingURL = server + "/api/booking";
  let token = localStorage.getItem("token");
  try {
    let respond = await fetch(getBookingURL, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    });
    let response = await respond.json();

    if (response.error) {
      throw new Error(`HTTP error! Status: ${response.message}`);
    } else if (response.ok) {
      // Refresh page
      location.reload();
    }
  } catch (error) {
    console.error("Error delete data:", error);
  }
}
