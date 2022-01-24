import { useState, useContext, useEffect, useRef } from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"
import LoginContext from "../LoginContext"
import CartItem from "./CartItem"

export default function Cart() {
  const [cart, setCart] = useState()
  const [userCart, setUserCart] = useState(0)
  const { loggedIn } = useContext(LoginContext)
  const history = useHistory()
  const [total, setTotal] = useState()
  const firstRender = useRef(true)

  useEffect(() => {
    if (!loggedIn) {
      history.push("/register")
      return
    }
    const item = JSON.parse(localStorage.getItem("user"))
    axios
      .get(`http://localhost:3001/api/cart/${item._id}`)
      .then((res) => {
        // CLEAN THIS UP LATER ON, SEEMS REPETITIVE
        setUserCart(res.data)
        let subTotal = 0
        let whiteShirts = []
        let redShirts = []
        let jeans = []
        let first = []
        let arr = res.data

        arr.forEach((item) => {
          subTotal += item.price
        })

        setTotal(subTotal)

        arr.forEach((item) => {
          if (item.iconCode == 1) {
            whiteShirts.push(item)
          }
          if (item.iconCode == 2) {
            redShirts.push(item)
          }
          if (item.iconCode == 3) {
            jeans.push(item)
          }
        })

        arr.every((_item) => {
          if (_item.name == "White T-Shirt") {
            first.push(_item)
            return false
          } else {
            return true
          }
        })

        arr.every((_item) => {
          if (_item.name == "Red T-Shirt") {
            first.push(_item)
            return false
          } else {
            return true
          }
        })

        arr.every((_item) => {
          if (_item.name == "Jeans") {
            first.push(_item)
            return false
          } else {
            return true
          }
        })

        let arrThree = first.map((item) => {
          return {
            item,
            quantity: 1,
          }
        })

        setCart(arrThree)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    let subTotal = 0
    cart.forEach((obj) => {
      subTotal += obj.item.price * obj.quantity
    })

    setTotal(subTotal)
  }, [cart])

  return (
    <div>
      <div className="container light-bg ">
        <div className="row title display-4 p-4">Shopping Cart</div>
        <hr></hr>
        {cart &&
          cart.map((doc) => {
            return <CartItem key={doc.item._id} item={doc.item} cart={cart} setCart={setCart} userCart={userCart} />
          })}
        <div className="row">
          <div className="title display-6 my-4 mx-2 col">Subtotal</div>
          <h1 className="title my-4 col">${total && total}</h1>
        </div>

        <button className="w-100 my-2 display-6 rounded">Proceed To Checkout</button>
      </div>
    </div>
  )
}
