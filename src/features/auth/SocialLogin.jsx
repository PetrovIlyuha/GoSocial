import React from "react"
import { useDispatch } from "react-redux"
import { Button } from "semantic-ui-react"
import { socialLogin } from "../../app/firestore/firebaseService"
import { closeModal } from "../../app/reusable/modals/modalReducer"

export default function SocialLogin() {
  const dispatch = useDispatch()
  function handleSocialLogin(provider) {
    dispatch(closeModal())
    socialLogin(provider)
  }
  return (
    <>
      <Button
        icon='facebook'
        onClick={() => handleSocialLogin("facebook")}
        fluid
        color='facebook'
        style={{ marginBottom: 10 }}
        content='Login with Facebook'
      />
      <Button
        icon='google'
        fluid
        onClick={() => handleSocialLogin("google")}
        color='google plus'
        content='Login with Google'
      />
    </>
  )
}
