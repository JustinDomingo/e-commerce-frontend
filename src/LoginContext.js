import { createContext, useState, useReducer, useEffect, useRef } from "react"
import axios from "axios"

export const LoginContext = createContext()

const loginReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, loggedIn: action.payload } //spread previous state so it'll contain all the properties
    case "TEST":
      return { ...state, test: action.payload }
    default:
      //always be sure to include default in case none of the types are met
      return state
  }
}

export function LoginProvider({ children }) {
  const firstRender = useRef(true)
  const [quantity, setQuantity] = useState()
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("user")))
  const [complete, setComplete] = useState(false)
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")))
  const [state, dispatch] = useReducer(loginReducer, {
    loggedIn: Boolean(localStorage.getItem("user")),
    complete: false,
    userData: JSON.parse(localStorage.getItem("user")),
    test: true,
  })

  useEffect(() => {
    if (userData) {
      axios.get(`https://myecommerceapp-api.herokuapp.com/api/user/${userData._id}`).then((res) => {
        setQuantity(res.data.cart.length)
      })
    }
  }, [])

  useEffect(() => {
    dispatch({ type: "TEST", payload: false })
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    console.log(state)
  }, [state])

  return <LoginContext.Provider value={{ loggedIn, setLoggedIn, userData, setUserData, complete, setComplete, state, dispatch, quantity, setQuantity }}>{children}</LoginContext.Provider>
}
