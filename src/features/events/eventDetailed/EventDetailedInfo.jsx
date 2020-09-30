import React, { useState } from "react"
import { Segment, Grid, Icon, Button } from "semantic-ui-react"
import { format } from "date-fns"
import EventDetailedMap from "./EventDetailedMap"

const EventDetailedInfo = ({ event }) => {
  const {
    description,
    date,
    venue: { address },
  } = event
  const [showMap, setShowMap] = useState(false)
  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Column width={1}>
            <Icon size='large' color='green' name='info' />
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{description}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='calendar' size='large' color='green' />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>{format(date, "MMMM d, yyyy h:mm a")}</span>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='marker' size='large' color='green' />
          </Grid.Column>
          <Grid.Column width={11}>
            <span>{address}</span>
          </Grid.Column>
          <Grid.Column width={4}>
            <Button
              color='violet'
              size='tiny'
              content={showMap ? "Hide Map" : "Show Map"}
              onClick={() => setShowMap(!showMap)}
            />
          </Grid.Column>
        </Grid>
      </Segment>
      {showMap && <EventDetailedMap coords={event.venue.latLng} />}
    </Segment.Group>
  )
}

export default EventDetailedInfo
