import React from "react"
import { Container } from "semantic-ui-react"

import { Route, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

import EventDashboard from "../../features/events/eventDashboard/EventDashboard"
import NavBar from "../../features/nav/NavBar"
import HomePage from "../../features/home/HomePage"
import EventDetailed from "../../features/events/eventDetailed/EventDetailed"
import EventForm from "../../features/events/eventForm/EventForm"
import ModalManager from "../reusable/modals/ModalManager"
import Sandbox from "../../features/Sandbox"
import ErrorMessage from "../reusable/ErrorMessage"
import AccountPage from "../../features/auth/AccountPage"
import Loading from "./Loading"
import ProfilePage from "../../features/profiles/profilePage/ProfilePage"

function App() {
  const { key } = useLocation()
  const { initialized } = useSelector(state => state.async)

  if (!initialized) return <Loading content='App is loading...' />
  return (
    <>
      <ModalManager />
      <Route path='/' component={HomePage} exact />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar />
            <Container className='main'>
              <Route path='/events' exact component={EventDashboard}></Route>
              <Route path='/events/:id' component={EventDetailed} />
              <Route path='/sandbox' component={Sandbox} />
              <Route
                key={key}
                path={["/createEvent", "/manage/:id"]}
                component={EventForm}
              />
              <Route path={"/settings"} component={AccountPage} />
              <Route path='/profile/:id' component={ProfilePage} />
              <Route path='/error' component={ErrorMessage} />
            </Container>
          </>
        )}
      />
    </>
  )
}

export default App
