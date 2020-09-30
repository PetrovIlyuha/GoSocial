import React from "react"
import { Field, Form, Formik } from "formik"
import { toast } from "react-toastify"
import * as Yup from "yup"
import { addEventChatComment } from "../../../app/firestore/firebaseService"
import { Loader } from "semantic-ui-react"

const EventDetailedChatForm = ({ eventId, parentId, closeForm }) => {
  return (
    <Formik
      initialValues={{ comment: "" }}
      validationSchema={Yup.object({
        comment: Yup.string().required(),
      })}
      onSubmit={async ({ comment }, { setSubmitting, resetForm }) => {
        try {
          await addEventChatComment(eventId, { comment, parentId })
          resetForm()
        } catch (error) {
          toast.error(error.message)
        } finally {
          setSubmitting(false)
          closeForm({ open: false, commentId: null })
        }
      }}>
      {({ isSubmitting, handleSubmit, isValid }) => (
        <Form className='ui form' style={{ marginTop: 20 }}>
          <Field name='comment'>
            {({ field }) => (
              <div style={{ position: "relative" }}>
                <Loader active={isSubmitting} />
                <textarea
                  rows='2'
                  {...field}
                  onKeyPress={e => {
                    if (e.key === "Enter" && e.shiftKey) {
                      return
                    }
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      isValid && handleSubmit()
                    }
                  }}
                  placeholder='Leave a comment...'></textarea>
              </div>
            )}
          </Field>
        </Form>
      )}
    </Formik>
  )
}

export default EventDetailedChatForm
