import React from "react"
import ModalWrapper from "../../app/reusable/modals/ModalWrapper"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import VersatileInput from "../../app/reusable/form/VersatileInput"
import { Button, Divider, Label } from "semantic-ui-react"
import { useDispatch } from "react-redux"
import { closeModal } from "../../app/reusable/modals/modalReducer"
import { registerOnFirebase } from "../../app/firestore/firebaseService"
import SocialLogin from "./SocialLogin"

const LoginForm = () => {
  const dispatch = useDispatch()
  return (
    <ModalWrapper size='mini' header='Register on GoSocial'>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required(),
          email: Yup.string().required().email(),
          password: Yup.string().required(),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await registerOnFirebase(values)
            setSubmitting(false)
            dispatch(closeModal())
          } catch (error) {
            setErrors({ auth: error.message })
            console.error(error)
          }
        }}>
        {({ isSubmitting, dirty, isValid, errors }) => (
          <Form className='ui form'>
            <VersatileInput name='username' placeholder='Username' />
            <VersatileInput
              name='email'
              placeholder='Your email for verification'
            />
            <VersatileInput
              name='password'
              placeholder='Password'
              type='password'
            />
            {errors.auth && (
              <Label
                basic
                color='red'
                style={{ marginBottom: "10px" }}
                content={errors.auth}
              />
            )}
            <Button
              loading={isSubmitting}
              type='submit'
              fluid
              size='huge'
              color='facebook'
              content='Register'
              disabled={!isValid || !dirty || isSubmitting}
            />
            <Divider horizontal>Or</Divider>
            <SocialLogin />
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  )
}

export default LoginForm
