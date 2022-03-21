import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons"
import { LoginContext } from "../LoginContext"
import { useState, useContext, useEffect } from "react"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import Stars from "./Stars"
import axios from "axios"

export default function Review({ item, setReviews }) {
  const [body, setBody] = useState(item.body)
  const [toggle, setToggle] = useState(false)
  const [inEdit, setInEdit] = useState(false)
  const [rating, setRating] = useState(item.rating)
  const [reviewValue, setReviewValue] = useState()
  const { userData } = useContext(LoginContext)
  const [starColor, setStarColor] = useState(["text-muted", "text-muted", "text-muted", "text-muted", "text-muted"])

  const handleEdit = () => {
    setInEdit(true)
    setToggle(false)
  }

  const handleDelete = async () => {
    try {
      let res = await axios.delete(`https://myecommerceapp-api.herokuapp.com/api/delete-review/${item._id}`)
      if (res.data === 20) {
        setReviews(null)
      }
      setReviews(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleBody = (e) => {
    setBody(e.target.value)
  }

  const handleCancel = () => {
    setInEdit(false)
    setBody(item.body)
    setStarColor(["text-muted", "text-muted", "text-muted", "text-muted", "text-muted"])
  }

  const handleStar = (num) => {
    if (num === 1) {
      setStarColor(["text-warning", "text-muted", "text-muted", "text-muted", "text-muted"])
      setReviewValue(1)
    }
    if (num === 2) {
      setStarColor(["text-warning", "text-warning", "text-muted", "text-muted", "text-muted"])
      setReviewValue(2)
    }
    if (num === 3) {
      setStarColor(["text-warning", "text-warning", "text-warning", "text-muted", "text-muted"])
      setReviewValue(3)
    }
    if (num === 4) {
      setStarColor(["text-warning", "text-warning", "text-warning", "text-warning", "text-muted"])
      setReviewValue(4)
    }
    if (num === 5) {
      setStarColor(["text-warning", "text-warning", "text-warning", "text-warning", "text-warning"])
      setReviewValue(5)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let res = await axios.post(`https://myecommerceapp-api.herokuapp.com/api/edit-review`, { body, id: item._id, updatedRating: reviewValue, author: item.author })
    setRating(res.data.rating)
    setBody(res.data.body)
    setInEdit(false)
  }

  return (
    <div className="container my-4">
      <div className="text-start row">
        <div className="light-text light-font col h3 p-0">
          {item.author} <Stars rating={rating} />
        </div>
        <div className="p-0 light-text light-font row">
          {inEdit ? (
            <form onSubmit={handleSubmit}>
              <textarea className="w-75 textarea" onChange={handleBody} value={body}></textarea>
              <div>
                <button className="border">Update</button>
                <button type="button" className="border mx-2" onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-none no-border"
                  onClick={(e) => {
                    handleStar(1)
                  }}
                >
                  <FontAwesomeIcon icon={faStar} className={starColor[0]}></FontAwesomeIcon>
                </button>
                <button
                  type="button"
                  className="bg-none no-border"
                  onClick={(e) => {
                    handleStar(2)
                  }}
                >
                  <FontAwesomeIcon icon={faStar} className={starColor[1]}></FontAwesomeIcon>
                </button>
                <button
                  type="button"
                  className="bg-none no-border"
                  onClick={(e) => {
                    handleStar(3)
                  }}
                >
                  <FontAwesomeIcon icon={faStar} className={starColor[2]}></FontAwesomeIcon>
                </button>
                <button
                  type="button"
                  className="bg-none no-border"
                  onClick={(e) => {
                    handleStar(4)
                  }}
                >
                  <FontAwesomeIcon icon={faStar} className={starColor[3]}></FontAwesomeIcon>
                </button>
                <button
                  type="button"
                  className="bg-none no-border"
                  onClick={(e) => {
                    handleStar(5)
                  }}
                >
                  <FontAwesomeIcon icon={faStar} className={starColor[4]}></FontAwesomeIcon>
                </button>
              </div>
            </form>
          ) : (
            <div className="col">{body}</div>
          )}
          {!inEdit && userData && userData.username === item.author && (
            <button
              onClick={() => {
                if (toggle) {
                  setToggle(false)
                  return
                }
                setToggle(true)
              }}
              className="col-1 text-end bg-none no-border ellipsis"
            >
              <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
            </button>
          )}

          {toggle && (
            <div className="text-end">
              <div>
                <button onClick={handleDelete} className="w-25 border text-dark reg">
                  Delete
                </button>
              </div>
              <button className="w-25 border reg text-dark" onClick={handleEdit}>
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
