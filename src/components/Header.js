import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import { useContext, useEffect, useState } from "react"
import LoginContext from "../LoginContext"
import axios from "axios"

export default function Header() {
  const { loggedIn, setLoggedIn, userData } = useContext(LoginContext)

  const handleLogout = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/logout`, { withCredentials: true })
    } catch (err) {
      console.log(err)
    }
    localStorage.removeItem("user")
    setLoggedIn(false)
  }

  return (
    <div>
      <div className="dark light-text">
        <div className="container">
          <div className="row">
            <div className="col h2 container">
              <div className="row">
                <Link to="/tops" className={`col light-font light-text`}>
                  Tops
                </Link>
                <Link to="/bottoms" className={`col light-font light-text`}>
                  Bottoms
                </Link>
              </div>
            </div>
            <Link to="/" className="col text-center display-4 title light-text">
              Fabrix
            </Link>
            <div className="col h2 container">
              <div className="row text-end">
                <Link to={`/cart/${userData && userData._id}`} className={`col light-font light-text`}>
                  <FontAwesomeIcon icon={faShoppingCart}></FontAwesomeIcon>
                </Link>
                {loggedIn ? (
                  <a onClick={handleLogout} className={`col light-font light-text`}>
                    Logout
                  </a>
                ) : (
                  <Link to="/register" className={`col light-font light-text`}>
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
