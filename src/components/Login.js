import { useState, useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import LoginContext from "../LoginContext"
import axios from "axios"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [areErrors, setAreErrors] = useState(false)
  const [error, setError] = useState(false)
  const { loggedIn, setLoggedIn } = useContext(LoginContext)
  const history = useHistory()

  useEffect(() => {
    if (loggedIn) {
      history.push("/") //when component is rendered, will check if loggedIn is true then push to homepage
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    let data = {
      username,
      password,
    }
    axios
      .post("http://localhost:3001/api/login", data, { withCredentials: true }) //always set "withCredentials to true when handling cookies"
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data)) //sets user document in localStorage NOT the jwt
        setLoggedIn(true)
        history.push("/")
      })
      .catch(() => {
        setAreErrors(true)
        setError("Invalid Username/Password")
      })
  }

  return (
    <div className="container text-center">
      <form onSubmit={handleSubmit}>
        <div className="light-text light-font m-2">Username</div>
        <input onChange={(e) => setUsername(e.target.value)} className="light-font  w-50" placeholder="Enter unique username..."></input>
        <div className="light-text light-font m-2">Password</div>
        <input onChange={(e) => setPassword(e.target.value)} type="password" className="light-font w-50" placeholder="Enter password..."></input>
        <div>
          <button className="border light-font m-2 w-50 reg dark">Login</button>
        </div>
        <div className="text-danger light-font m-2">{areErrors && error}</div>
      </form>
    </div>
  )
}
