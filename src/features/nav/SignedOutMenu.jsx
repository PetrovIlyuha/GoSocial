import React from "react"
import { Menu, Button } from "semantic-ui-react"
import { useDispatch } from "react-redux"
import { openModal } from "../../app/reusable/modals/modalReducer"

const SignedOutMenu = () => {
  const dispatch = useDispatch()
  return (
    <Menu.Item position='right'>
      <Button
        onClick={() => dispatch(openModal({ modalType: "LoginForm" }))}
        inverted
        color='purple'
        content='Login'
        icon='sign-in'
      />
      <Button
        inverted
        color='pink'
        content='Sign Up'
        icon='signup'
        style={{ marginLeft: "0.4rem" }}
        onClick={() => dispatch(openModal({ modalType: "RegisterForm" }))}
      />
    </Menu.Item>
  )
}

export default SignedOutMenu
