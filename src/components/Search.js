import { useState, useEffect, useRef } from "react"
import { Link, useHistory } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"

export default function Search() {
  const [word, setWord] = useState("")
  const [items, setItems] = useState()
  const history = useHistory()
  const firstRender = useRef(true)

  const arrayFilter = (array) => {
    let finalArr = []
    let previous
    let filteredOne = array.filter((item) => item.name.toLowerCase().includes(word))
    let filteredTwo = filteredOne.sort((a, b) => {
      return a.name.length - b.name.length
    })
    filteredTwo.forEach((item) => {
      if (previous != item.name) {
        previous = item.name //detects changes
        finalArr.push(item)
      }
    })
    return finalArr
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (word == "") {
      setItems()
      return
    }
    axios.get(`http://localhost:3001/api/clothes`).then((res) => {
      let arr = arrayFilter(res.data)
      setItems(arr)
    })
  }, [word])

  const handleChange = (e) => {
    setWord(e.target.value)
  }

  const handleClick = (item) => {
    history.push(`/${item.category}/${item._id}`)
    setItems()
  }

  return (
    <div className="text-start">
      <div>
        <input onChange={handleChange} placeHolder="Search..." className="w-25 no-border light-font search my-2"></input>
        <button className="search no-border bg-dark white">
          <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
        </button>
        <div className="review w-25">
          {items &&
            items.map((item) => (
              <div>
                <button
                  onClick={() => {
                    handleClick(item)
                  }}
                  className="w-100 text-start item text-start text-dark light-font border"
                >
                  {item.name}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
