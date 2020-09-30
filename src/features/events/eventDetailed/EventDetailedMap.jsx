import React from "react"
import { Segment, Icon } from "semantic-ui-react"
import GoogleMapReact from "google-map-react"

const Marker = () => <Icon name='marker' size='huge' color='red' />

const EventDetailedMap = ({ coords }) => {
  let zoom = 14
  return (
    <Segment attached='bottom' style={{ padding: 0, marginTop: 10 }}>
      <div style={{ height: 300, width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAsVzqPRGFTKmy_Nvae9o6QlfM-3ihlkEA" }}
          center={coords}
          zoom={zoom}>
          <Marker lat={coords.lat} lng={coords.lng} text='My Marker' />
        </GoogleMapReact>
      </div>
    </Segment>
  )
}

export default EventDetailedMap
