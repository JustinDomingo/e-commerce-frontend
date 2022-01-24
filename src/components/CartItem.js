import { useState, useEffect, useContext } from "react"
import LoginContext from "../LoginContext"
import axios from "axios"

export default function CartItem({ item, doc, cart, setCart, userCart }) {
  const { userData } = useContext(LoginContext)
  const [quantity, setQuantity] = useState(null)

  useEffect(() => {
    let arr = userCart.filter((_item) => {
      return _item.name === item.name
    })
    console.log(arr)
    setQuantity(arr.length)
  }, [])

  const handleAdd = async () => {
    let res = await axios.post("http://localhost:3001/api/add-quantity", { user: userData, item }, { withCredentials: true })
    let cart = res.data
    let sortedItems = cart.filter((_item) => {
      return _item.name === item.name
    })
    setQuantity(sortedItems.length)
  }

  const handleSubtract = async () => {
    let res = await axios.post("http://localhost:3001/api/subtract-quantity", { user: userData, item }, { withCredentials: true })
    console.log(res.data)
    let cart = res.data
    let sortedItems = cart.filter((_item) => {
      return _item.name === item.name
    })
    setQuantity(sortedItems.length)
  }

  return (
    <div>
      <div className="row">
        <div className="row col display-6 m-2">
          {item.name}
          <h2 className="col-1 text-center border rounded mx-1">{quantity && quantity}</h2>
          <button className="col-1 rounded mx-1 h5" onClick={handleAdd}>
            +
          </button>
          <button className="col-1 rounded h3 mx-1" onClick={handleSubtract}>
            -
          </button>
        </div>
        <h1 className="col title">${item.price}</h1>
      </div>
    </div>
  )
}
