import React from "react"
import { Formik, Form } from "formik"
import { Button, Grid, Header, Label, Segment } from "semantic-ui-react"
import * as Yup from "yup"
import VersatileInput from "../../app/reusable/form/VersatileInput"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { updateUserPassword } from "../../app/firestore/firebaseService"
const AccountPage = () => {
  const { currentUser } = useSelector(state => state.auth)
  return (
    <Segment>
      <Header dividing size='large' content='Your Account' />
      {currentUser.providerId === "password" && (
        <>
          <Header color='red' sub content='Change Password' />
          <p>User this form to change your password</p>
          <Formik
            initialValues={{ newPassword1: "", newPassword2: "" }}
            validationSchema={Yup.object({
              newPassword1: Yup.string().required("Password is required"),
              newPassword2: Yup.string().oneOf(
                [Yup.ref("newPassword1"), null],
                "Passwords do not match"
              ),
            })}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              try {
                await updateUserPassword(values)
              } catch (error) {
                setErrors({ auth: error.message })
              } finally {
                setSubmitting(false)
              }
            }}>
            {({ errors, isSubmitting, isValid, dirty }) => (
              <Form className='ui form'>
                <VersatileInput
                  name='newPassword1'
                  type='password'
                  placeholder='New password'
                />
                <VersatileInput
                  name='newPassword2'
                  type='password'
                  placeholder='Confirm password'
                />
                {errors.auth && (
                  <Label
                    ribbon
                    style={{ marginBottom: 20 }}
                    position='right'
                    color='red'
                    content={errors.auth}
                  />
                )}
                <Button
                  style={{ display: "block" }}
                  disabled={!isValid || !dirty || isSubmitting}
                  type='submit'
                  loading={isSubmitting}
                  content='Change'
                  color='red'
                  size='large'
                  positive
                />
              </Form>
            )}
          </Formik>
        </>
      )}
      {currentUser.providerId === "facebook.com" && (
        <Grid divided='vertically' style={{ marginTop: 10 }}>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Header color='blue' sub content='Facebook account management' />
              <p>Please visit the facebook to update your account!</p>
              <Button
                icon='facebook'
                color='facebook'
                as={Link}
                to='https://facebook.com'
                content='Go to Facebook'
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
      {currentUser.providerId === "google.com" && (
        <Grid divided='vertically' style={{ marginTop: 10 }}>
          <Grid.Row columns={1}>
            <Grid.Column>
              <Header color='blue' sub content='Google account management' />
              <p>Please visit google to update your account!</p>
              <Button
                icon='google'
                color='google plus'
                as={Link}
                to='https://google.com'
                content='Go to Google'
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </Segment>
  )
}

export default AccountPage
