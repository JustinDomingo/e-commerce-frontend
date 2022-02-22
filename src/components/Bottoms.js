import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Tops() {
  const [bottoms, setBottoms] = useState([])

  useEffect(() => {
    axios.get("https://myecommerceapp-api.herokuapp.com/api/bottoms").then((res) => {
      console.log(res.data)
      setBottoms(res.data)
    })
  }, [])

  return (
    <div>
      <div className="light-text display-4 m-4 text-center">Bottoms</div>
      <hr className="text-light"></hr>
      <div className="container dark-2">
        <div className="title text-light display-5 m-4">Jeans</div>
        <div className="row">
          {bottoms &&
            bottoms.map((pants) => {
              return (
                <Link key={pants._id} to={`/pants/${pants._id}`} className="col-3 no-dec display-1 m-3 item shadow text-center">
                  {pants.iconCode === 3 ? <img className="h-75" alt="pants" src="https://img.icons8.com/external-photo3ideastudio-flat-photo3ideastudio/64/000000/external-pants-clothes-photo3ideastudio-flat-photo3ideastudio.png" /> : console.log()}
                </Link>
              )
            })}
        </div>
      </div>
    </div>
  )
}
