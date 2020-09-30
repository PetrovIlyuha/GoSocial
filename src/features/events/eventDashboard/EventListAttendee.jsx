import React from "react"
import { Link } from "react-router-dom"
import { List, Image } from "semantic-ui-react"

const EventListAttendee = ({ person }) => {
  const { photoURL } = person
  return (
    <List.Item as={Link} to={`/profile/${person.id}`}>
      <Image size='mini' circular src={photoURL} />
    </List.Item>
  )
}

export default EventListAttendee
