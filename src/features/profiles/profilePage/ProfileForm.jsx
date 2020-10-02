import { Form, Formik } from "formik"
import React from "react"
import * as Yup from "yup"

import { Button } from "semantic-ui-react"

import VersatileInput from "../../../app/reusable/form/VersatileInput"
import VersatileTextArea from "../../../app/reusable/form/VersatileTextArea"
import { updateUserProfile } from "../../../app/firestore/firestoreService"
import { toast } from "react-toastify"

const ProfileForm = ({ profile }) => {
  return (
    <Formik
      initialValues={{
        displayName: profile.displayName,
        description: profile.description || "",
      }}
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        console.log(values)
        try {
          await updateUserProfile(values)
        } catch (error) {
          toast.error(error.message)
        } finally {
          setSubmitting(false)
        }
      }}>
      {({ isSubmitting, isValid, dirty }) => (
        <Form className='ui form'>
          <VersatileInput name='displayName' placeholder='Display Name' />
          <VersatileTextArea name='description' placeholder='description...' />
          <Button
            loading={isSubmitting}
            disabled={isSubmitting || !isValid || !dirty}
            floated='right'
            type='submit'
            size='large'
            positive
            content='Update Profile'
          />
        </Form>
      )}
    </Formik>
  )
}

export default ProfileForm
