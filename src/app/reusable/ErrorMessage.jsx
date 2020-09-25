import React from "react"
import { useSelector } from "react-redux"
import { Segment, Button, Header } from "semantic-ui-react"
import { Link } from "react-router-dom"

const ErrorMessage = () => {
  const { error } = useSelector(state => state.async)
  return (
    <Segment placeholder>
      <Header
        textAlign='center'
        content={error?.message || "We have a situation here..."}
      />
      <Button
        as={Link}
        to='/events'
        primary
        style={{ marginTop: 20 }}
        content='Return to Events'
      />
    </Segment>
  )
}

export default ErrorMessage
