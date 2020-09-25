import React, { useState } from "react"
import { Grid } from "semantic-ui-react"
import EventList from "./EventList"
import { useSelector, useDispatch } from "react-redux"
import EventListItemPlaceholder from "./EventListItemPlaceholder"
import EventFilters from "./EventFilters"
import { listenToEventsFromFireStore } from "../../../app/firestore/firestoreService"
import { listenToEvents } from "../eventActions"
import useFirestoreCollection from "../../../app/hooks/useFirestoreCollection"

const EventDashboard = () => {
  const dispatch = useDispatch()
  const { events } = useSelector(state => state.event)
  const { loading } = useSelector(state => state.async)
  const [predicate, setPredicate] = useState(
    new Map([
      ["startDate", new Date()],
      ["filter", "all"],
    ])
  )

  const handleSetPredicate = (key, value) => {
    setPredicate(new Map(predicate.set(key, value)))
  }

  useFirestoreCollection({
    query: () => listenToEventsFromFireStore(predicate),
    data: events => dispatch(listenToEvents(events)),
    deps: [dispatch, predicate],
  })
  return (
    <Grid>
      <Grid.Column width={10}>
        {loading && (
          <>
            <EventListItemPlaceholder />
          </>
        )}
        {events && <EventList events={events} />}
      </Grid.Column>
      <Grid.Column width={6}>
        <EventFilters
          loading={loading}
          predicate={predicate}
          setPredicate={handleSetPredicate}
        />
      </Grid.Column>
    </Grid>
  )
}

export default EventDashboard
