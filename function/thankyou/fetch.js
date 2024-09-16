import { server } from "../common/server.js"

export async function getOrders(orderNumber){
  let token = localStorage.getItem('token')
  let respond = await fetch(`${server}/api/orders/${orderNumber}`,{
    method: 'GET',
    headers: new Headers({
        "Content-Type": 'application/json',
        'Authorization': `Bearer ${token}`
      })
  })
  respond = await respond.json()
  return respond
}