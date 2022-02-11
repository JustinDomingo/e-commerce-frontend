import { useState, useEffect, useContext, useRef } from "react"
import LoginContext from "../LoginContext"
import axios from "axios"
import { useHistory } from "react-router-dom"

// Personal email: sb-hmbrx12666311@personal.example.com
// Personal password: 6PIfD^Ro

export default function Checkout() {
  const { setComplete, userData } = useContext(LoginContext)
  const history = useHistory()
  const paypal = useRef()
  const [user, setUser] = useState()
  const [subtotal, setSubtotal] = useState()
  const [cart, setCart] = useState()
  const [addOne, setAddOne] = useState("")
  const [addTwo, setAddTwo] = useState(null)
  const [addThree, setAddThree] = useState("")
  const [addFour, setAddFour] = useState("")
  const [addFive, setAddFive] = useState("")
  const [address, setAddress] = useState()

  useEffect(() => {
    axios
      .get(`https://myecommerceapp-api.herokuapp.com/api/user/${userData._id}`)
      .then((res) => {
        setUser(res.data)
        console.log(JSON.stringify(res.data))
        if (res.data.address.length) {
          setAddress(res.data.address)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    axios.get(`https://myecommerceapp-api.herokuapp.com/api/cart/${userData._id}`).then((res) => {
      if (!res.data.length) {
        history.push("/")
      }
      let total = 0
      res.data.forEach((item) => {
        total += item.price
      })
      setSubtotal(total)
      setCart(res.data)
      window.paypal
        .Buttons({
          // Sets up the transaction when a payment button is clicked
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: total, // Can reference variables or functions. Example: `value: document.getElementById('...').value`
                  },
                },
              ],
            })
          },

          // Finalize the transaction after payer approval
          onApprove: function (data, actions) {
            return actions.order.capture().then(async function (orderData) {
              // Successful capture! For dev/demo purposes:
              console.log("Capture result", orderData, JSON.stringify(orderData, null, 2))
              let currentUser
              axios
                .get(`https://myecommerceapp-api.herokuapp.com/api/user/${userData._id}`)
                .then((res) => {
                  currentUser = res.data
                })
                .catch((err) => {
                  console.log(err)
                })
              setComplete(true)
              axios
                .delete(`https://myecommerceapp-api.herokuapp.com/api/cart/${userData._id}`)
                .then((res) => {
                  console.log(res.data)
                })
                .catch((err) => {
                  console.log("failed")
                })
              axios
                .delete(`https://myecommerceapp-api.herokuapp.com/api/remove-stock/${userData._id}`, { user: currentUser })
                .then(() => {
                  console.log("Success")
                })
                .catch((err) => {
                  console.log("failed")
                })
              history.push("/thank-you")
            })
          },
          onError: (err) => {
            console.log(err)
          },
        })
        .render(paypal.current)
    })
  }, [history, setComplete, userData._id])

  const handleAddress = (e) => {
    let code = parseInt(e.target.getAttribute("data-code"))
    if (code === 1) {
      setAddOne(e.target.value)
    }
    if (code === 2) {
      setAddTwo(e.target.value)
    }
    if (code === 3) {
      setAddThree(e.target.value)
    }
    if (code === 4) {
      setAddFour(e.target.value)
    }
    if (code === 5) {
      setAddFive(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let str
    if (addTwo) {
      str = addOne + " " + addTwo + " " + addThree + " " + addFour + " " + addFive
    } else {
      str = addOne + ", " + addThree + ", " + addFour + ", " + addFive
    }
    try {
      let res = await axios.put(`https://myecommerceapp-api.herokuapp.com/api/update-address/${userData._id}`, { address: str })
      setAddress(res.data.address)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`https://myecommerceapp-api.herokuapp.com/api/update-address/${userData._id}`)
      setAddress(null)
    } catch (err) {}
  }

  return (
    <div>
      <div className="container light-bg ">
        <div className="row title display-4 p-4">Checkout</div>
        <hr></hr>
        <div className="row">
          <div className="col">
            {!address ? <div className="title display-6 my-4 mx-2 col">Enter Shipping Address</div> : <div className="title display-6 my-4 mx-2 col">Current Shipping Address</div>}
            {!address ? (
              <form onSubmit={handleSubmit}>
                <input onChange={handleAddress} data-code="1" placeholder="Address Line 1" className="p-1 w-100 border h4 light-font"></input>
                <input onChange={handleAddress} data-code="2" placeholder="Address Line 2 (Optional)" className="p-1 w-100 border h4 light-font"></input>
                <div>
                  <input onChange={handleAddress} data-code="3" placeholder="City" className="p-1 border h4 light-font col-4"></input>
                  <input onChange={handleAddress} data-code="4" placeholder="State" className="p-1 border h4 light-font col-4"></input>
                  <input onChange={handleAddress} data-code="5" placeholder="Zipcode" className="p-1 border h4 light-font col-4"></input>
                  <button className="light-font h4 border-light">Set Address</button>
                </div>
              </form>
            ) : (
              <div className="light-font h4 mx-2">
                {address && address}
                <button className="mx-2 border-light bg-danger border text-whitew" onClick={handleDelete}>
                  x
                </button>
              </div>
            )}
            <div className="title display-6 my-4 mx-2 col">
              Choose Payment Method<div className="text-center my-2" ref={paypal}></div>
            </div>
          </div>
          <div className="col container rounded">
            <div className="row">
              <div className="title display-6 my-4 col">Order Summary</div>
              <hr></hr>
              {cart && (
                <div className="row my-2">
                  <div className="title h2 col">Items ({cart && cart.length})</div>
                  <div className="title h2 col text-center">${subtotal && subtotal}.00</div>
                </div>
              )}
              <hr></hr>
              <div className="title display-6 col">Grand Total:</div>
              <h1 className="title col">US${subtotal && subtotal}.00</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
