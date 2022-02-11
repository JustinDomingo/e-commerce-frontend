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
  const [red, setRed] = useState([]) //array of only red shirts
  const [white, setWhite] = useState([]) //array of only white shirts
  const [name, setName] = useState("")
  const [color, setColor] = useState("")
  const firstRender = useRef(true)
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

  const handleClick = () => {
    if (!loggedIn) {
      history.push("/register") //redirects if user isn't logged in
      return
    }
    const userData = JSON.parse(localStorage.getItem("user")) //grabs current user data from localStorage
    axios.post("https://myecommerceapp-api.herokuapp.com/api/add-item", { data: shirt, user: userData }).then((res) => {
      console.log(res.data)
    })
  }

  return (
    <div>
      <div className="container text-center my-5">
        <div className="row text-center">
          <FontAwesomeIcon icon={faTshirt} className={`${color && color} icon col light py-3 shadow`}></FontAwesomeIcon>
          <div className="display-4 light-text col">
            {name && name}
            <div className="container row light-text">
              <div className="display-6 col border rounded mx-1">S</div>
              <div className="display-6 col border rounded mx-1">M</div>
              <div className="display-6 col border rounded mx-1">L</div>
              <div className="display-6 col border rounded mx-1">XL</div>
            </div>
            <div className="container row light-text">
              <div className="text-start my-1">$10</div>
              <button className="no-border light light-font h1" onClick={handleClick}>
                Add to cart
              </button>
            </div>
            {red && color === "red" ? <div className={`display-6 mx-3 text-start ${red.length <= 10 ? `text-danger` : `text-light`}`}>{red.length} left in stock</div> : console.log()}
            {red && color === "white" ? <div className={`display-6 mx-3 text-start ${white.length <= 10 ? `text-danger` : `text-light`}`}>{white.length} left in stock</div> : console.log()}
            <hr></hr>
            <div className="display-5 text-end">About</div>
            <p className="text-end display-6">A simple, good-quality t-shirt. How much simpler can it get?</p>
          </div>
        </div>
      </div>
    </div>
  )
}
