import React from "react"
import { Grid } from "semantic-ui-react"
import EventDetailedHeader from "./EventDetailedHeader"
import EventDetailedInfo from "./EventDetailedInfo"
import EventDetailedChat from "./EventDetailedChat"
import EventDetailedSidebar from "./EventDetailedSidebar"
import Loading from "../../../app/layout/Loading"
import { useSelector, useDispatch } from "react-redux"
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc"
import { listenToEventFromFirestore } from "../../../app/firestore/firestoreService"
import { listenToEvents } from "../eventActions"
import { Redirect } from "react-router-dom"

const EventDetailed = ({ match }) => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector(state => state.auth)
  const event = useSelector(state =>
    state.event.events.find(e => e.id === match.params.id)
  )
  const { loading, error } = useSelector(state => state.async)

  useFirestoreDoc({
    query: () => listenToEventFromFirestore(match.params.id),
    data: event => dispatch(listenToEvents([event])),
    deps: [match.params.id],
  })

  let isHost = event?.hostUid === currentUser.uid
  const isGoing = event?.attendees?.some(a => a.id === currentUser.uid)
  if (loading || (!event && !error))
    return <Loading content='Loading events...' />

  if (error) {
    return <Redirect to='/error' />
  }
  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader event={event} isHost={isHost} isGoing={isGoing} />
        <EventDetailedInfo event={event} />
        <EventDetailedChat eventId={event.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar
          attendees={event?.attendees}
          hostUid={event?.hostUid}
        />
      </Grid.Column>
    </Grid>
  )
}

export default EventDetailed
