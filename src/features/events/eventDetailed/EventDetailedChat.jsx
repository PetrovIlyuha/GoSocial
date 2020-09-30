import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { formatDistance } from "date-fns"
import { Segment, Header, Comment } from "semantic-ui-react"
import {
  firebaseObjectToArray,
  getEventChatRef,
} from "../../../app/firestore/firebaseService"
import { listenToEventChat } from "../eventActions"
import EventDetailedChatForm from "./EventDetailedChatForm"
import { Link } from "react-router-dom"
import { CLEAR_COMMENTS } from "../eventConstants"
import { createDataTree } from "../../../app/utils/helpers"

const EventDetailedChat = ({ eventId }) => {
  const dispatch = useDispatch()
  const [showReplyForm, setShowReplyForm] = useState({
    open: false,
    commentId: null,
  })
  const { comments } = useSelector(state => state.event)

  function handleCloseReplyForm() {
    setShowReplyForm({ open: false, commentId: null })
  }

  useEffect(() => {
    getEventChatRef(eventId).on("value", snapshot => {
      if (!snapshot.exists) {
        return
      } else {
        if (snapshot.val()) {
          let comments = firebaseObjectToArray(snapshot.val()).reverse()
          dispatch(listenToEventChat(comments))
        }
      }
    })
    return () => {
      dispatch({ type: CLEAR_COMMENTS })
      getEventChatRef().off()
    }
  }, [eventId, dispatch])

  return (
    <>
      <Segment
        textAlign='center'
        attached='top'
        inverted
        color='green'
        style={{ border: "none" }}>
        <Header>Chat about this event</Header>
      </Segment>

      <Segment attached>
        <EventDetailedChatForm
          eventId={eventId}
          parentId={0}
          closeForm={setShowReplyForm}
        />
        <Comment.Group>
          {createDataTree(comments).map(comment => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.photoURL} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                  {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>
                    {formatDistance(new Date(comment.date), Date.now(), {
                      addSuffix: true,
                    })}
                  </div>
                </Comment.Metadata>
                <Comment.Text>
                  {comment.text.split("\n").map((text, i) => (
                    <span key={i}>
                      {text}
                      <br />
                    </span>
                  ))}
                </Comment.Text>
                <Comment.Actions>
                  <Comment.Action
                    onClick={() =>
                      setShowReplyForm({ open: true, commentId: comment.id })
                    }>
                    Reply
                  </Comment.Action>
                  {showReplyForm.open &&
                    showReplyForm.commentId === comment.id && (
                      <>
                        <Comment.Action
                          onClick={() =>
                            setShowReplyForm({ open: false, commentId: null })
                          }>
                          Close
                        </Comment.Action>
                        <EventDetailedChatForm
                          eventId={eventId}
                          parentId={comment.id}
                          closeForm={handleCloseReplyForm}
                        />
                      </>
                    )}
                </Comment.Actions>
              </Comment.Content>
              {comment.childNodes.length > 0 && (
                <Comment.Group>
                  {comment.childNodes.reverse().map(child => (
                    <Comment key={child.id}>
                      <Comment.Avatar src={child.photoURL} />
                      <Comment.Content>
                        <Comment.Author as={Link} to={`/profile/${child.uid}`}>
                          {child.displayName}
                        </Comment.Author>
                        <Comment.Metadata>
                          <div>
                            {formatDistance(new Date(child.date), Date.now(), {
                              addSuffix: true,
                            })}
                          </div>
                        </Comment.Metadata>
                        <Comment.Text>
                          {child.text.split("\n").map((text, i) => (
                            <span key={i}>
                              {text}
                              <br />
                            </span>
                          ))}
                        </Comment.Text>
                        <Comment.Actions>
                          <Comment.Action
                            onClick={() =>
                              setShowReplyForm({
                                open: true,
                                commentId: child.id,
                              })
                            }>
                            Reply
                          </Comment.Action>
                          {showReplyForm.open &&
                            showReplyForm.commentId === child.id && (
                              <>
                                <Comment.Action
                                  onClick={() =>
                                    setShowReplyForm({
                                      open: false,
                                      commentId: null,
                                    })
                                  }>
                                  Close
                                </Comment.Action>
                                <EventDetailedChatForm
                                  eventId={eventId}
                                  parentId={child.parentId}
                                  closeForm={handleCloseReplyForm}
                                />
                              </>
                            )}
                        </Comment.Actions>
                      </Comment.Content>
                    </Comment>
                  ))}
                </Comment.Group>
              )}
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  )
}

export default EventDetailedChat
