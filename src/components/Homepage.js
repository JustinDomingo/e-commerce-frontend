import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTshirt } from "@fortawesome/free-solid-svg-icons"

export default function Homepage() {
  const [items, setItems] = useState({ shirts: [], pants: [] })
  const [firstShirt, setFirstShirt] = useState([])
  const [firstPants, setFirstPants] = useState([])

  useEffect(() => {
    //Main purpose is to get only the first item of array with certain property value
    let arr = []
    let arrTwo = []

    items.shirts.every((item) => {
      //"every" allows looping to end if something falsy is returned
      if (item.iconCode == 1) {
        arr.push(item)
        return false
      } else {
        return true //Be sure to always include else
      }
    })

    items.shirts.every((item) => {
      if (item.iconCode == 2) {
        arr.push(item)
        return false
      } else {
        return true
      }
    })

    setFirstShirt(arr)

    items.pants.every((item) => {
      if (item.iconCode == 4) {
        arrTwo.push(item)
        return false
      } else {
        return true
      }
    })
    setFirstPants(arrTwo)
  }, [items])

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/items")
      .then((res) => {
        setItems(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <div className="light-text text-center display-4 m-4">Popular Items</div>
      <hr className="text-white"></hr>
      <div className="container dark-2">
        <div className="title text-light display-5 m-4">Shirts</div>
        <div className="row">
          {firstShirt &&
            firstShirt.map((shirt) => {
              return (
                <Link key={shirt._id} to={`/shirts/${shirt._id}`} className="col-3 no-dec display-1 m-3 item text-center">
                  {shirt.iconCode == 1 ? <FontAwesomeIcon icon={faTshirt} className="text-white"></FontAwesomeIcon> : shirt.iconCode == 2 ? <FontAwesomeIcon icon={faTshirt} className="text-danger"></FontAwesomeIcon> : <div>Blue</div>}
                </Link>
              )
            })}
        </div>
        <div className="title text-white display-5 m-4">Pants</div>
        <div className="row">
          {firstPants &&
            firstPants.map((pants) => {
              return (
                <Link key={pants._id} to={`/pants/${pants._id}`} className="col-3 no-dec display-1 m-3 item shadow text-center">
                  {pants.iconCode == 4 ? <img className="h-75" src="https://img.icons8.com/external-photo3ideastudio-flat-photo3ideastudio/64/000000/external-pants-clothes-photo3ideastudio-flat-photo3ideastudio.png" /> : console.log()}
                </Link>
              )
            })}
        </div>
      </div>
    </>
  )
}
