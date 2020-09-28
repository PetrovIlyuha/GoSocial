import React from "react"
import { Menu, Image, Dropdown } from "semantic-ui-react"
import { Link, useHistory } from "react-router-dom"
import UserAvatar from "../../assets/user.png"
import { useSelector } from "react-redux"
import { ToastContainer, toast } from "react-toastify"
import { signOutFirebaseUser } from "../../app/firestore/firebaseService"

const SignedInMenu = () => {
  const history = useHistory()
  const { currentUserProfile } = useSelector(state => state.profile)

  const handleSignOut = async () => {
    try {
      history.push("/")
      await signOutFirebaseUser()
    } catch (err) {
      toast.error(err.message)
    }
  }
  return (
    <Menu.Item position='right'>
      <Image
        avatar
        spaced='right'
        src={currentUserProfile?.photoURL || UserAvatar}
      />
      <Dropdown pointing='top left' text={currentUserProfile?.displayName}>
        <Dropdown.Menu>
          <Dropdown.Item
            as={Link}
            to='/createEvent'
            text='Create Event'
            icon='plus'
          />
          <Dropdown.Item
            as={Link}
            to={`/profile/${currentUserProfile?.id}`}
            text='My Profile'
            icon='user'
          />
          <Dropdown.Item
            as={Link}
            to='/settings'
            icon='settings'
            text='Account Settings'
          />
          <Dropdown.Item to='Sign Out' icon='power' onClick={handleSignOut} />
        </Dropdown.Menu>
      </Dropdown>
      <ToastContainer />
    </Menu.Item>
  )
}

export default SignedInMenu
