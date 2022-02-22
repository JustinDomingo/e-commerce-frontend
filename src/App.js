import "./App.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { useState } from "react"
import Checkout from "./components/Checkout"
import LoginContext from "./LoginContext"
import Header from "./components/Header"
import Homepage from "./components/Homepage"
import Register from "./components/Register"
import ShirtDetails from "./components/ShirtDetails"
import PantsDetails from "./components/PantsDetails"
import Cart from "./components/Cart"
import Login from "./components/Login"
import Tops from "./components/Tops"
import Bottoms from "./components/Bottoms"
import ThankYou from "./components/ThankYou"
import Footer from "./components/Footer"

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("user")))
  const [complete, setComplete] = useState(false)
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")))

  return (
    <div>
      <LoginContext.Provider value={{ loggedIn, setLoggedIn, userData, setUserData, complete, setComplete }}>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              <Homepage />
            </Route>
            <Route path="/shirts/:id">
              <ShirtDetails />
            </Route>
            <Route path="/tops">
              <Tops />
            </Route>
            <Route path="/bottoms">
              <Bottoms />
            </Route>
            <Route path="/pants/:id">
              <PantsDetails />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/cart">
              <Cart />
            </Route>
            <Route path="/checkout">
              <Checkout />
            </Route>
            <Route path="/thank-you">
              <ThankYou />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </LoginContext.Provider>
    </div>
  )
}

export default App
