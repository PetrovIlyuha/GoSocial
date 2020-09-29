import { toast } from "react-toastify"

import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_EVENTS,
  LISTEN_TO_EVENT_CHAT,
} from "./eventConstants"
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from "../../app/async/asyncReducer"
import { fetchSampleData } from "../../app/api/mockApi"

export function loadEvents() {
  return async function (dispatch) {
    dispatch(asyncActionStart())
    try {
      const events = await fetchSampleData()
      dispatch({ type: FETCH_EVENTS, payload: events })
      toast.success("here are your events!")
      dispatch(asyncActionFinish())
    } catch (err) {
      dispatch(asyncActionError(err))
      toast.error("Error loading Data! Don't be mad on us...")
    }
  }
}

export function listenToEvents(events) {
  return {
    type: FETCH_EVENTS,
    payload: events,
  }
}

export function createEvent(event) {
  return {
    type: CREATE_EVENT,
    payload: event,
  }
}

export function updateEvent(event) {
  return {
    type: UPDATE_EVENT,
    payload: event,
  }
}

export function deleteEvent(eventID) {
  return {
    type: DELETE_EVENT,
    payload: eventID,
  }
}

export function listenToEventChat(comments) {
  return {
    type: LISTEN_TO_EVENT_CHAT,
    payload: comments,
  }
}
