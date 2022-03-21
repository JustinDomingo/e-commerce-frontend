import { useState, useContext, useEffect } from "react"
import { useHistory, Link } from "react-router-dom"
import { LoginContext } from "../LoginContext"
import axios from "axios"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordErrors, setPasswordErrors] = useState(null)
  const [emailErrors, setEmailErrors] = useState(null)
  const [usernameErrors, setUsernameErrors] = useState(null)
  const { loggedIn, setLoggedIn, setUserData, setQuantity } = useContext(LoginContext)
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
      email,
      password,
    }
    axios
      .post("https://myecommerceapp-api.herokuapp.com/api/register", data, { withCredentials: true }) //always set "withCredentials to true when handling cookies"
      .then((response) => {
        axios.get(`https://myecommerceapp-api.herokuapp.com/api/user/${response.data._id}`).then((res) => {
          if (res.data.cart.length) {
            setQuantity(res.data.cart.length)
          } else {
            setQuantity()
          }
          localStorage.setItem("user", JSON.stringify(response.data)) //sets user document in localStorage NOT the jwt
          setUserData(response.data)
          setLoggedIn(true)
        })
      })
      .catch((item) => {
        let err = JSON.parse(item.request.response)
        if (err.passwordErrors) {
          setPasswordErrors(err.passwordErrors)
        } else {
          setPasswordErrors(null)
        }
        if (err.usernameErrors) {
          setUsernameErrors(err.usernameErrors)
        } else {
          setUsernameErrors(null)
        }
        if (err.emailErrors) {
          setEmailErrors(err.emailErrors)
        } else {
          setEmailErrors(null)
        }
      })
  }

  return (
    <div className="container text-center">
      <form onSubmit={handleSubmit}>
        <div className="light-text light-font m-2">Email</div>
        <div className="text-danger light-font">{emailErrors && emailErrors}</div>
        <input onChange={(e) => setEmail(e.target.value)} className="light-font  w-50" placeholder="Enter valid email..."></input>
        <div className="light-text light-font m-2">Username</div>
        <div className="text-danger light-font">{usernameErrors && usernameErrors}</div>
        <input onChange={(e) => setUsername(e.target.value)} className="light-font  w-50" placeholder="Enter unique username..."></input>
        <div className="light-text light-font m-2">Password</div>
        <div className="text-danger light-font">{passwordErrors && passwordErrors}</div>
        <input onChange={(e) => setPassword(e.target.value)} type="password" className="light-font w-50" placeholder="Enter password..."></input>
        <div>
          <button className="border light-font m-2 w-50 reg dark">Register now!</button>
        </div>
        <div className="light-font light-text h5">
          Already have an account? Click <Link to="/login">here.</Link>
        </div>
      </form>
    </div>
  )
}
