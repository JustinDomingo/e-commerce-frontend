import { useState, useEffect, useContext } from "react"
import LoginContext from "../LoginContext"
import axios from "axios"

export default function CartItem({ item, userCart, setTotal }) {
  const { userData } = useContext(LoginContext)
  const [quantity, setQuantity] = useState(null)

  useEffect(() => {
    let arr = userCart.filter((_item) => {
      return _item.name === item.name
    })
    console.log(arr)
    setQuantity(arr.length)
  }, [item.name, userCart])

  const handleAdd = async () => {
    try {
      let size = item.size
      let res = await axios.post("https://myecommerceapp-api.herokuapp.com/api/add-quantity", { user: userData, item, size }, { withCredentials: true })
      let cart = res.data
      let total = 0
      cart.forEach((item) => {
        total += item.price
      })
      let sortedItems = cart.filter((_item) => {
        return _item.name === item.name
      })
      setTotal(total)
      setQuantity(sortedItems.length)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubtract = async () => {
    let res = await axios.post("https://myecommerceapp-api.herokuapp.com/api/subtract-quantity", { user: userData, item }, { withCredentials: true })
    let cart = res.data
    console.log(cart)
    let total = 0
    cart.forEach((item) => {
      total += item.price
    })

    let sortedItems = cart.filter((_item) => {
      return _item.name === item.name
    })
    setTotal(total)
    setQuantity(sortedItems.length)
  }

  return (
    <div>
      <div className="row">
        <div className="row col display-6 m-2">
          {item.name}
          <h2 className="col-1 light-font text-center border rounded mx-1">{quantity && quantity}</h2>
          <button className="col-1 rounded mx-1 h5 border-light" onClick={handleAdd}>
            +
          </button>
          <button className="col-1 rounded h3 mx-1 border-light" onClick={handleSubtract}>
            -
          </button>
        </div>
        <h1 className="col title">${quantity && item.price * quantity}</h1>
      </div>
    </div>
  )
}
