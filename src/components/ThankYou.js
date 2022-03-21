import { useContext } from "react"
import { useHistory } from "react-router-dom"
import { LoginContext } from "../LoginContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"

export default function ThankYou() {
  const history = useHistory()
  const { complete } = useContext(LoginContext)

  if (!complete) {
    history.push("/")
  }
  return (
    <div className="container light-bg ">
      <div className="text-center">
        <FontAwesomeIcon icon={faCheck} className="display-2 text-success text-center mt-4"></FontAwesomeIcon>
      </div>
      <div className="title display-5 text-center">Thank you for your purchase!</div>
      <hr></hr>
      <div className="title light-font h2 text-center pb-4 text-muted">A receipt/confirmation will be emailed to you shortly</div>
    </div>
  )
}
