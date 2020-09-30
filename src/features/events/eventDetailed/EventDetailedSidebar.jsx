import React from "react"
import { Link } from "react-router-dom"
import { Segment, Item, Label } from "semantic-ui-react"

const EventDetailedSidebar = ({ attendees, hostUid }) => {
  return (
    <>
      <Segment
        textAlign='center'
        style={{ border: "none" }}
        attached='top'
        secondary
        inverted
        color='blue'>
        {attendees.length} {attendees.length > 1 ? "People" : "Person"} Going
      </Segment>
      {attendees.map(attendee => (
        <Segment attached key={attendee.id}>
          <Item.Group relaxed divided>
            <Item
              as={Link}
              to={`/profile/${attendee.id}`}
              style={{ position: "relative" }}>
              {hostUid === attendee.id && (
                <Label
                  style={{ position: "absolute" }}
                  color='red'
                  ribbon='right'
                  content='Organizer'
                />
              )}
              <Item.Image size='tiny' src={attendee.photoURL} />
              <Item.Content verticalAlign='middle'>
                <Item.Header as='h3'>
                  <span>{attendee.name}</span>
                </Item.Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      ))}
    </>
  )
}

export default EventDetailedSidebar
