import React, { useState, useEffect, useCallback } from "react"
import { Segment, Image, Item, Header, Button } from "semantic-ui-react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import {
  addUserAttendance,
  cancelUserAttendance,
} from "../../../app/firestore/firestoreService"
import { toast } from "react-toastify"

const eventImageStyle = {
  filter: "brightness(30%)",
}

const eventImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
}

const EventDetailedHeader = ({ event, isHost, isGoing }) => {
  const { title, date, hostedBy, category } = event
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const loadImage = useCallback(async () => {
    const image = await import(
      `../../../assets/categoryImages/${category.toLowerCase()}.jpg`
    )
    setImage(image)
  }, [category])

  useEffect(() => {
    loadImage()
  }, [event, loadImage])

  const handleUserJoinEvent = async () => {
    setLoading(true)
    try {
      addUserAttendance(event)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUserLeaveEvent = async () => {
    setLoading(true)
    try {
      await cancelUserAttendance(event)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: "0" }}>
        {image && <Image style={eventImageStyle} src={image.default} fluid />}
        <Segment basic style={eventImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={title}
                  style={{ color: "white" }}
                />
                <p>Event Date: {format(date, "MMMM d, yyyy h:mm a")}</p>
                <p>
                  Hosted by{" "}
                  <strong>
                    <Link to={`/profile/${event.hostUid}`}>{hostedBy}</Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached='bottom' clearing>
        {!isHost && (
          <>
            {isGoing ? (
              <Button onClick={handleUserLeaveEvent} floated='left' color='red'>
                Cancel My Place
              </Button>
            ) : (
              <Button
                color='blue'
                floated='left'
                loading={loading}
                onClick={handleUserJoinEvent}>
                JOIN THIS EVENT
              </Button>
            )}
          </>
        )}
        {isHost && (
          <Button
            as={Link}
            to={`/manage/${event.id}`}
            color='violet'
            floated='right'>
            Manage Event
          </Button>
        )}
      </Segment>
    </Segment.Group>
  )
}

export default EventDetailedHeader
