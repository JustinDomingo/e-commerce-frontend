import "./App.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Checkout from "./components/Checkout"
import { LoginProvider } from "./LoginContext"
import Header from "./components/Header"
import HeaderTwo from "./components/HeaderTwo"
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
  return (
    <div>
      <LoginProvider>
        <Router>
          <Header />
          <HeaderTwo />
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
      </LoginProvider>
    </div>
  )
}

export default App
