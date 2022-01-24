import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTshirt } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"

export default function Tops() {
  const [tops, setTops] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/tops")
      .then((res) => {
        console.log(res.data)
        setTops(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div>
      <div className="light-text display-4 m-4 text-center">Tops</div>
      <hr className="text-light"></hr>
      <div className="container dark-2">
        <div className="title text-light display-5 m-4">T-shirts</div>
        <div className="row">
          {tops &&
            tops.map((shirt) => {
              return (
                <Link key={shirt._id} to={`/shirts/${shirt._id}`} className="col-3 no-dec display-1 m-3 item text-center">
                  {shirt.iconCode == 1 ? <FontAwesomeIcon icon={faTshirt} className="text-white"></FontAwesomeIcon> : shirt.iconCode == 2 ? <FontAwesomeIcon icon={faTshirt} className="text-danger"></FontAwesomeIcon> : <div>Blue</div>}
                </Link>
              )
            })}
        </div>
      </div>
    </div>
  )
}
