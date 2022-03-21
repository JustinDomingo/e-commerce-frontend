import { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import { LoginContext } from "../LoginContext"
import ReviewComponent from "./ReviewComponent"
import axios from "axios"

export default function PantsDetails() {
  const [data, setData] = useState("")
  const [sizeSelected, setSizeSelected] = useState(false)
  const [sizeStock, setSizeStock] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()
  const [messageClass, setMessageClass] = useState()
  const [single, setSingle] = useState()
  const history = useHistory()
  const { loggedIn, userData } = useContext(LoginContext)

  useEffect(() => {
    axios
      .get(`https://myecommerceapp-api.herokuapp.com/api/pants`, { withCredentials: true })
      .then((res) => {
        console.log(res.data)
        setSingle(res.data[0])
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const openMessage = (bool, style, text) => {
    setShowMessage(bool)
    setMessageClass(style)
    setMessage(text)
  }

  const handleClick = () => {
    if (!loggedIn) {
      history.push("/register")
      return
    }
    if (sizeSelected) {
      const randomNum = Math.floor(Math.random() * data.length)
      axios
        .post("https://myecommerceapp-api.herokuapp.com/api/add-item", { data: data[randomNum], user: userData }, { withCredentials: true })
        .then((res) => {
          openMessage(true, "success", "Item successfully added")
        })
        .catch(() => {
          openMessage(true, "danger", "Item is already in your cart")
        })
    } else {
      openMessage(true, "danger", "Please select a size")
    }
  }

  const handleSize = (size) => {
    if (data) {
      let length
      let filtered = data.filter((item) => {
        return item.size === size
      })
      if (filtered.length) {
        length = filtered.length
      } else {
        length = 0
      }
      setSizeSelected(true)
      setSizeStock(length)
    }
  }

  return (
    <div>
      <div className="container text-center my-5">
        <div className="row text-center">
          <img alt="pants" className="w-50 h-50 light" src="https://img.icons8.com/external-photo3ideastudio-flat-photo3ideastudio/64/000000/external-pants-clothes-photo3ideastudio-flat-photo3ideastudio.png" />
          <div className="display-4 light-text col">
            {data && data[0].name}
            <div className="container row light-text">
              <button
                className="display-6 dark-2 text-light col border rounded mx-1"
                onClick={() => {
                  handleSize("small")
                }}
              >
                S
              </button>
              <button
                className="display-6 dark-2 text-light col border rounded mx-1"
                onClick={() => {
                  handleSize("medium")
                }}
              >
                M
              </button>
              <button
                className="display-6 col dark-2 text-light border rounded mx-1"
                onClick={() => {
                  handleSize("large")
                }}
              >
                L
              </button>
              <button
                className="display-6 col dark-2 text-light border rounded mx-1"
                onClick={() => {
                  handleSize("x-large")
                }}
              >
                XL
              </button>
            </div>
            <div className="container row light-text">
              <div className="text-start my-1">$20</div>
              <button onClick={handleClick} className="no-border light light-font h1">
                Add to cart
              </button>
              {showMessage && <div className={`text-${messageClass && messageClass} text-start display-6 p-1`}>{message && message}</div>}
            </div>
            {sizeSelected && <div className={`display-6 mx-3 text-start ${sizeStock && sizeStock <= 5 ? `text-danger` : `text-light`}`}>{sizeStock && sizeStock} left in stock</div>}
            <hr></hr>
            <div className="display-5 text-end">About</div>

            <p className="text-end display-6">How about some nice blue jeans with those simple t-shirts?</p>
          </div>
          <hr className="light-text"></hr>
          {single && <ReviewComponent code={single.iconCode} />}
        </div>
      </div>
    </div>
  )
}

//Cannot use `` in JSX, make sure to wrap in curly braces.
