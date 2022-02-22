import "../App.css"
import { useParams } from "react-router-dom"
import { useState, useEffect, useContext, useRef } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTshirt } from "@fortawesome/free-solid-svg-icons"
import LoginContext from "../LoginContext"

export default function ItemDetails() {
  const [data, setData] = useState("")
  const [shirt, setShirt] = useState("")
  const [stock, setStock] = useState()
  const [showError, setShowError] = useState(false)
  const [message, setMessage] = useState(null)
  const [flash, setFlash] = useState(null)
  const [red, setRed] = useState([]) //array of only red shirts
  const [white, setWhite] = useState([]) //array of only white shirts
  const [name, setName] = useState("")
  const [color, setColor] = useState("")
  const [sizeSelected, setSizeSelected] = useState(false)
  const [size, setSize] = useState()
  const firstRender = useRef(true)
  const _firstRender = useRef(true)
  const { id } = useParams() //Params get saved as object properties
  const { loggedIn } = useContext(LoginContext)
  const history = useHistory()

  useEffect(() => {
    axios
      .get("https://myecommerceapp-api.herokuapp.com/api/shirts/")
      .then((res) => {
        let arrOne = []
        let arrTwo = []
        res.data.forEach((item) => {
          if (item.name === "Red T-Shirt") {
            arrOne.push(item) //puts all red shirts in arrOne
          }
          if (item.name === "White T-Shirt") {
            arrTwo.push(item) //puts all white shirts in arrOne
          }
        })
        setRed(arrOne)
        setWhite(arrTwo)
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    //function is to get the color
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    axios
      .get(`https://myecommerceapp-api.herokuapp.com/api/shirts/${id}`) //gets single shirt
      .then((res) => {
        setName(res.data.name)
        if (res.data.iconCode === 1) {
          setColor("white")
        }
        if (res.data.iconCode === 2) {
          setColor("red")
        }
        if (res.data.iconCode === 3) {
          setColor("blue")
        }
        if (res.data.name === "Red T-Shirt") {
          setShirt(red[0])
        }
        if (res.data.name === "White T-Shirt") {
          setShirt(white[0])
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [data, id, red, white]) //listens for change in "data" state

  useEffect(() => {
    if (_firstRender.current) {
      _firstRender.current = false
      return
    }
    setSizeSelected(true)
    setShowError(false)
  }, [stock])

  const handleClick = () => {
    if (!loggedIn) {
      history.push("/register") //redirects if user isn't logged in
      return
    }
    if (sizeSelected) {
      const userData = JSON.parse(localStorage.getItem("user")) //grabs current user data from localStorage
      let obj
      let specificShirts = data.filter((item) => {
        return item.name === shirt.name
      })
      specificShirts.every((item) => {
        if (item.size === size) {
          obj = item
          return true
        } else {
          return false
        }
      })
      axios
        .post("https://myecommerceapp-api.herokuapp.com/api/add-item", { data: obj, user: userData })
        .then((res) => {
          setMessage("Item successfully added")
          setFlash("success")
        })
        .catch(() => {
          setMessage("Item is already in your cart.")
          setFlash("danger")
        })
    } else {
      setShowError(true)
    }
  }

  const handleSize = async (size, color) => {
    try {
      let res = await axios.get(`https://myecommerceapp-api.herokuapp.com/api/shirts/sizes/${shirt.name}/${size}`)
      setStock(res.data)
      setSize(size)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <div className="container text-center my-5">
        <div className="row text-center">
          <FontAwesomeIcon icon={faTshirt} className={`${color && color} icon col light py-3 shadow`}></FontAwesomeIcon>
          <div className="display-4 light-text col">
            {name && name}
            <div className="container row light-text">
              <button className="display-6 col border dark-2 text-white rounded mx-1" onClick={() => handleSize("small", color)}>
                S
              </button>
              <button className="display-6 col border dark-2 text-white rounded mx-1" onClick={() => handleSize("medium", color)}>
                M
              </button>
              <button className="display-6 col border dark-2 text-white rounded mx-1" onClick={() => handleSize("large", color)}>
                L
              </button>
              <button className="display-6 col border dark-2 text-white rounded mx-1" onClick={() => handleSize("xl", color)}>
                XL
              </button>
            </div>
            <div className="container row light-text">
              <div className="text-start my-1">$10</div>
              <button className="no-border light light-font h1" onClick={handleClick}>
                Add to cart
              </button>
              {message && <div className={`text-${flash && flash} text-start display-6 p-1`}>{message && message}</div>}
              {showError && <div className="text-danger text-start display-6 p-1">Please select a size.</div>}
            </div>
            {sizeSelected && (
              // you don't need "?" for ternary operators unless you need a second condition
              <div>
                {red && color === "red" && <div className={`display-6 mx-3 text-start ${red.length <= 5 ? `text-danger` : `text-light`}`}>{stock} left in stock</div>}
                {red && color === "white" && <div className={`display-6 mx-3 text-start ${white.length <= 5 ? `text-danger` : `text-light`}`}>{stock} left in stock</div>}
              </div>
            )}
            <hr></hr>
            <div className="display-5 text-end">About</div>
            <p className="text-end display-6">A simple, good-quality t-shirt. How much simpler can it get?</p>
          </div>
        </div>
      </div>
    </div>
  )
}
