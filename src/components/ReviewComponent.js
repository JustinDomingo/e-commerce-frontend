import React from "react"
import axios from "axios"
import Review from "./Review"
import { LoginContext } from "../LoginContext"
import { useState, useEffect, useContext, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"

export default function ReviewComponent({ code }) {
  const { userData } = useContext(LoginContext)
  const [toggleReview, setToggleReview] = useState(false)
  const [starColor, setStarColor] = useState(["text-muted", "text-muted", "text-muted", "text-muted", "text-muted"])
  const [reviewBody, setReviewBody] = useState("")
  const [reviewValue, setReviewValue] = useState()
  const [reviewError, setReviewError] = useState(false)
  const [errorCode, setErrorCode] = useState(0)
  const [reviews, setReviews] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const firstRender = useRef(true)

  useEffect(() => {
    console.log(code)
    axios
      .get(`https://myecommerceapp-api.herokuapp.com/api/reviews/${code}`)
      .then((res) => {
        let total = 0
        res.data.forEach((item) => {
          total += item.rating
        })
        let average = total / res.data.length
        if (res.data.length) {
          setReviews(res.data)
          setIsLoading(false)
          return
        }
        setIsLoading(false)
      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err)
      })
  }, [])

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
    try {
      e.preventDefault()
      let res = await axios.post(`https://myecommerceapp-api.herokuapp.com/api/create-review`, { body: reviewBody, rating: reviewValue, username: userData.username, code })
      setToggleReview(false)
      setStarColor(["text-muted", "text-muted", "text-muted", "text-muted", "text-muted"])
      setReviewBody("")
      setReviews(res.data)
    } catch (err) {
      console.log(err.response.data) //this is how to access error data
      setReviewError(true)
      setErrorCode(err.response.data.code)
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="display-5 text-start light-text">Review this product</div>
          <hr className="light-text"></hr>
          <p className="text-start display-6 light-text">Share your opinion to other customers!</p>
          {!toggleReview ? (
            <button
              className="w-100 display-6 border light-font h1"
              onClick={() => {
                setToggleReview(true)
              }}
            >
              Write a review
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea
                onChange={(e) => {
                  setReviewBody(e.target.value)
                }}
                className="textarea w-100"
              ></textarea>
              <div className="text-end">
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
                <button className="no-border mx-2 light-font">Post</button>
                <button
                  className="no-border light-font"
                  onClick={() => {
                    setToggleReview(false)
                    setStarColor(["text-muted", "text-muted", "text-muted", "text-muted", "text-muted"])
                    setReviewBody("")
                    setReviewError(false)
                  }}
                >
                  Cancel
                </button>
                {reviewError && <div className="text-danger text-end p-1">You can only post one review</div>}
              </div>
            </form>
          )}
        </div>
        <div className="col">
          <div className="display-5 text-start light-text">Reviews</div>
          <hr className="light-text"></hr>
          {isLoading && <div className="text-center h2 light-text light-font">Loading...</div>}
          {reviews && <div>{reviews.length ? reviews.map((item) => <Review item={item} setReviews={setReviews} key={item._id} />) : <div className="text-center h2 light-text light-font">No posts yet...</div>}</div>}
        </div>
      </div>
    </div>
  )
}
