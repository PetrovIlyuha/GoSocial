import React from "react"
import { Grid } from "semantic-ui-react"
import ProfileHeader from "./ProfileHeader"
import ProfileContent from "./ProfileContent"
import { useDispatch, useSelector } from "react-redux"
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc"
import { listenToSelectedProfile } from "../profileActions"
import { getUserProfile } from "../../../app/firestore/firestoreService"
import Loading from "../../../app/layout/Loading"

const ProfilePage = ({ match }) => {
  const dispatch = useDispatch()

  const { selectedUserProfile } = useSelector(state => state.profile)
  const { currentUser } = useSelector(state => state.auth)
  const { loading, error } = useSelector(state => state.async)

  useFirestoreDoc({
    query: () => getUserProfile(match.params.id),
    data: profile => dispatch(listenToSelectedProfile(profile)),
    deps: [dispatch, match.params.id],
  })

  if ((loading && !selectedUserProfile) || (!selectedUserProfile && !error)) {
    return <Loading content='Loading profile...' />
  }
  return (
    <Grid>
      <Grid.Column width={16}>
        <Grid.Column>
          <ProfileHeader
            profile={selectedUserProfile}
            isCurrentUser={currentUser.uid === selectedUserProfile.id}
          />
          <ProfileContent
            profile={selectedUserProfile}
            isCurrentUser={currentUser.uid === selectedUserProfile.id}
          />
        </Grid.Column>
      </Grid.Column>
    </Grid>
  )
}

export default ProfilePage
