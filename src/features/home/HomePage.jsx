import React from "react"
import {
  Segment,
  Container,
  Header,
  Image,
  Button,
  Icon,
} from "semantic-ui-react"
import Logo from "../../assets/GoSocial_Logo_Light.jpg"

const HomePage = ({ history }) => {
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          display: "flex",
          flexDirection: "column",
        }}>
        <Header as='h1' inverted>
          <Image
            src={Logo}
            style={{
              padding: "10px 15px",
              width: "40%",
              background: "rgba(0,0,190,0.8)",
              borderRadius: 10,
              border: "2px solid whitesmoke",
            }}
          />
        </Header>
        <Button
          size='huge'
          color='green'
          style={{ width: "40%", marginLeft: "29%" }}
          onClick={() => history.push("/events")}>
          Get started
          <Icon name='right arrow' />
        </Button>
      </Container>
    </Segment>
  )
}

export default HomePage
