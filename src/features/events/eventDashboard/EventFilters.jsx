import React from "react"
import { Menu, Header } from "semantic-ui-react"
import Calendar from "react-calendar"

const EventFilters = ({ loading, predicate, setPredicate }) => {
  return (
    <>
      <Menu vertical size='large' style={{ width: "100%" }}>
        <Header icon='filter' attached color='teal' content='Filters' />
        <Menu.Item
          content='All'
          disabled={loading}
          active={predicate.get("filter") === "all"}
          onClick={() => setPredicate("filter", "all")}
        />
        <Menu.Item
          color='red'
          content='I intend to Go'
          disabled={loading}
          active={predicate.get("filter") === "isGoing"}
          onClick={() => setPredicate("filter", "isGoing")}
        />
        <Menu.Item
          color='red'
          content='My Events'
          disabled={loading}
          active={predicate.get("filter") === "isHosting"}
          onClick={() => setPredicate("filter", "isHosting")}
        />
      </Menu>
      <Header icon='calendar' attached color='teal' content='Select Date' />
      <Calendar
        onChange={date => setPredicate("startDate", date)}
        value={predicate.get("startDate") || new Date()}
        tileDisabled={() => loading}
      />
    </>
  )
}

export default EventFilters
