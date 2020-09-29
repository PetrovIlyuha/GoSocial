import React from "react"
import { Segment, Item, Icon, List, Button, Label } from "semantic-ui-react"
import EventListAttendee from "./EventListAttendee"
import defaultUserPhoto from "../../../assets/user.png"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { deleteEventInFirestore } from "../../../app/firestore/firestoreService"

const EventListItem = ({ event }) => {
  const {
    attendees,
    description,
    title,
    venue: { address },
    date,
    hostPhotoURL,
    hostedBy,
  } = event

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              size='tiny'
              circular
              src={hostPhotoURL || defaultUserPhoto}
            />
            <Item.Content>
              <Item.Header content={title} />
              <Item.Description>
                Hosted by{" "}
                <Link to={`/profile/${event.hostUid}`}>{hostedBy}</Link>
              </Item.Description>
              {event.isCancelled && (
                <Label
                  style={{ top: "-30px" }}
                  ribbon='right'
                  color='red'
                  content='Cancelled'
                />
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Item>
          <Item.Content>
            <Icon name='clock' color='black' />
            <span>{format(date, "MMMM d, yyyy h:mm a")}</span>{" "}
            <Icon name='marker' color='black' />
            <span>{address}</span>
          </Item.Content>
        </Item>
      </Segment>
      <Segment secondary>
        <List horizontal>
          {attendees.map((person, idx) => (
            <EventListAttendee key={idx} person={person} />
          ))}
        </List>
      </Segment>
      <Segment clearing>
        <div>
          <strong>What to expect from the event:</strong> <br /> {description}{" "}
        </div>
        <Button
          onClick={() => deleteEventInFirestore(event.id)}
          color='red'
          floated='right'
          content='Remove ✖'
        />
        <Button
          as={Link}
          to={`/events/${event.id}`}
          color='facebook'
          floated='right'
          content='Details'
        />
      </Segment>
    </Segment.Group>
  )
}

export default EventListItem
