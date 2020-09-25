import React from "react"
import { Menu, Container, Button } from "semantic-ui-react"
import Logo from "../../assets/GoSocial-Logo.png"
import { NavLink } from "react-router-dom"
import SignedOutMenu from "./SignedOutMenu"
import SignedInMenu from "./SignedInMenu"
import { useSelector } from "react-redux"

const NavBar = ({ onCreateEvent }) => {
  const { authenticated } = useSelector(state => state.auth)

  return (
    <Menu fixed='top'>
      <Container>
        <Menu.Item
          as={NavLink}
          exact
          to='/'
          color='red'
          header
          activeStyle={activeClass}>
          <img src={Logo} alt='logo' style={{ width: 86 }} />
        </Menu.Item>
        <Menu.Item
          name='Events'
          as={NavLink}
          to='/events'
          activeStyle={activeClass}
        />
        <Menu.Item
          name='Sandbox'
          as={NavLink}
          to='/sandbox'
          activeStyle={activeClass}
        />
        {authenticated && (
          <Menu.Item
            as={NavLink}
            to='/createEvent'
            activeStyle={{
              fontWeight: "bold",
              backgroundColor: "#30BCED",
              color: "white",
            }}>
            <Button
              color='violet'
              content='Create new Event'
              onClick={onCreateEvent}
            />
          </Menu.Item>
        )}
        {authenticated ? <SignedInMenu /> : <SignedOutMenu />}
      </Container>
    </Menu>
  )
}

export default NavBar

const activeClass = {
  fontWeight: "bold",
  backgroundColor: "#30BCED",
  color: "white",
}
