import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"

export default function Stars({ rating }) {
  const [starColor, setStarColor] = useState(["text-muted", "text-muted", "text-muted", "text-muted", "text-muted"])

  useEffect(() => {
    if (rating === 1) {
      setStarColor(["text-warning", "text-muted", "text-muted", "text-muted", "text-muted"])
    }
    if (rating === 2) {
      setStarColor(["text-warning", "text-warning", "text-muted", "text-muted", "text-muted"])
    }
    if (rating === 3) {
      setStarColor(["text-warning", "text-warning", "text-warning", "text-muted", "text-muted"])
    }
    if (rating === 4) {
      setStarColor(["text-warning", "text-warning", "text-warning", "text-warning", "text-muted"])
    }
    if (rating === 5) {
      setStarColor(["text-warning", "text-warning", "text-warning", "text-warning", "text-warning"])
    }
  }, [rating])

  return (
    <>
      <FontAwesomeIcon icon={faStar} className={starColor[0]}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faStar} className={starColor[1]}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faStar} className={starColor[2]}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faStar} className={starColor[3]}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faStar} className={starColor[4]}></FontAwesomeIcon>
    </>
  )
}
