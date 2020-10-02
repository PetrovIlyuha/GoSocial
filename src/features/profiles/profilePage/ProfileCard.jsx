import React from "react"
import { Link } from "react-router-dom"
import { Card, Image } from "semantic-ui-react"

const ProfileCard = ({ profile }) => {
  return (
    <Card as={Link} to={`/profile/${profile.id}`}>
      <Image src={profile.photoURL} />
      <Card.Content>
        <Card.Header content={profile.displayName} />
      </Card.Content>
    </Card>
  )
}

export default ProfileCard
