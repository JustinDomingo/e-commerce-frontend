import { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import LoginContext from "../LoginContext"
import axios from "axios"

export default function PantsDetails() {
  const [data, setData] = useState("")
  const history = useHistory()
  const { loggedIn, userData } = useContext(LoginContext)

  useEffect(() => {
    axios
      .get(`https://myecommerceapp-api.herokuapp.com/api/pants`, { withCredentials: true })
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleClick = () => {
    if (!loggedIn) {
      history.push("/register")
      return
    }
    console.log(userData)
    const randomNum = Math.floor(Math.random() * data.length)
    axios.post("https://myecommerceapp-api.herokuapp.com/api/add-item", { data: data[randomNum], user: userData }, { withCredentials: true }).then((res) => {
      console.log(res.data)
    })
  }

  return (
    <div>
      <div className="container text-center my-5">
        <div className="row text-center">
          <img alt="pants" className="w-50 h-50 light" src="https://img.icons8.com/external-photo3ideastudio-flat-photo3ideastudio/64/000000/external-pants-clothes-photo3ideastudio-flat-photo3ideastudio.png" />
          <div className="display-4 light-text col">
            {data && data[0].name}
            <div className="container row light-text">
              <div className="display-6 col border rounded mx-1">S</div>
              <div className="display-6 col border rounded mx-1">M</div>
              <div className="display-6 col border rounded mx-1">L</div>
              <div className="display-6 col border rounded mx-1">XL</div>
            </div>
            <div className="container row light-text">
              <div className="text-start my-1">$20</div>
              <button onClick={handleClick} className="no-border light light-font h1">
                Add to cart
              </button>
            </div>
            <div className={`display-6 mx-3 text-start ${data && data.length <= 10 ? `text-danger` : `text-light`}`}>{data && data.length} left in stock</div>
            <hr></hr>
            <div className="display-5 text-end">About</div>

            <p className="text-end display-6">How about some nice blue jeans with those simple t-shirts?</p>
          </div>
        </div>
      </div>
    </div>
  )
}

//Cannot use `` in JSX, make sure to wrap in curly braces.
