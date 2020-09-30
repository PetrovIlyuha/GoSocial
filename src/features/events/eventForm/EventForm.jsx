/* global google */
import React, { useState } from "react"
import { Button, Segment, Header, Divider, Confirm } from "semantic-ui-react"
import { useSelector, useDispatch } from "react-redux"
import { listenToEvents } from "../eventActions"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import VersatileInput from "../../../app/reusable/form/VersatileInput"
import VersatileTextArea from "../../../app/reusable/form/VersatileTextArea"
import UniversalSelect from "../../../app/reusable/form/UniversalSelect"
import { categoryData as categoryOptions } from "../../../app/api/categoryOptions"
import ReactDate from "../../../app/reusable/form/ReactDate"
import { Link, Redirect } from "react-router-dom"
import GooglePlacesInput from "../../../app/reusable/form/GooglePlacesInput"
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc"
import {
  listenToEventFromFirestore,
  updateEventInFirestore,
  addEventToFirestore,
  cancelEventToggle,
} from "../../../app/firestore/firestoreService"
import Loading from "../../../app/layout/Loading"
import { ToastContainer, toast } from "react-toastify"

const EventForm = ({ match, history }) => {
  const dispatch = useDispatch()
  const [loadingCancel, setLoadingCancel] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { loading, error } = useSelector(state => state.async)
  const selectedEvent = useSelector(state =>
    state.event.events.find(e => e.id === match.params.id)
  )

  const initialFormState = selectedEvent ?? {
    title: "",
    category: "",
    description: "",
    city: {
      address: "",
      latLng: null,
    },
    venue: {
      address: "",
      latLng: null,
    },
    date: "",
  }

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is a crucial field!"),
    category: Yup.string().required("Category must be specified!"),
    description: Yup.string().required("Description must be specified!"),
    city: Yup.object().shape({
      address: Yup.string().required("Address is required!"),
    }),
    venue: Yup.object().shape({
      address: Yup.string().required("Venue is required!"),
    }),
    date: Yup.string().required("Please select the Date"),
  })

  async function handleCancelToggle(event) {
    setConfirmOpen(false)
    setLoadingCancel(true)
    try {
      await cancelEventToggle(event)
      setLoadingCancel(false)
    } catch (err) {
      setLoadingCancel(true)
      toast.error(error.message)
    }
  }

  useFirestoreDoc({
    query: () => listenToEventFromFirestore(match.params.id),
    data: event => dispatch(listenToEvents([event])),
    deps: [match.params.id],
    shouldExecute: !!match.params.id,
  })

  if (loading) return <Loading content='Loading events...' />
  if (error) {
    return <Redirect to='/error' />
  }

  return (
    <Segment clearing>
      <Formik
        initialValues={initialFormState}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            selectedEvent
              ? await updateEventInFirestore(values)
              : await addEventToFirestore(values)
            history.push("/events")
            toast.success(`Event updated!`)
          } catch (error) {
            toast.error(error.message)
            setSubmitting(false)
          }
        }}>
        {({ isSubmitting, dirty, isValid, values }) => (
          <Form className='ui form'>
            <Header color='violet' content='Event Details' />
            <Divider />
            <VersatileInput name='title' placeholder='Event title' />
            <UniversalSelect
              name='category'
              placeholder='Category'
              options={categoryOptions}
            />
            <VersatileTextArea
              name='description'
              placeholder='Description'
              rows={3}
            />
            <Header color='violet' content='Event Location Details' />
            <Divider />
            <GooglePlacesInput name='city' placeholder='City' />
            <GooglePlacesInput
              name='venue'
              disabled={!values.city.latLng}
              placeholder='Venue'
              options={{
                location: new google.maps.LatLng(values.city.latLng),
                radius: 1000,
                types: ["establishment"],
              }}
            />
            <ReactDate
              name='date'
              placeholderText='Date'
              timeFormat='HH:mm'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm a'
            />
            {selectedEvent && (
              <Button
                loading={loadingCancel}
                type='button'
                floated='left'
                color={selectedEvent.isCancelled ? "green" : "red"}
                content={selectedEvent.isCancelled ? "Reactivate" : "Cancel"}
                onClick={() => setConfirmOpen(true)}
              />
            )}
            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              type='submit'
              floated='right'
              positive
              content='Submit'
            />
            <Button
              type='submit'
              floated='right'
              content='Cancel'
              as={Link}
              to='/events'
            />
          </Form>
        )}
      </Formik>
      <ToastContainer />
      <Confirm
        content={
          selectedEvent && selectedEvent.isCancelled
            ? "Reactivate event?"
            : "Cancel Event?"
        }
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => handleCancelToggle(selectedEvent)}
      />
    </Segment>
  )
}

export default EventForm
