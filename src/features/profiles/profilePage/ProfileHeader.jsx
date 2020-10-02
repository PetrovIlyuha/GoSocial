import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Item,
  Reveal,
  Segment,
  Statistic,
} from "semantic-ui-react"
import {
  followUser,
  getFollowingDoc,
  unfollowUser,
} from "../../../app/firestore/firestoreService"
import { setFollowUser, setUnfollowUser } from "../profileActions"

import DefaultUserAvatar from "../../../assets/user.png"
import { CLEAR_FOLLOWINGS } from "../profileConstants"

const ProfileHeader = ({ profile, isCurrentUser }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { followingUser } = useSelector(state => state.profile)
  useEffect(() => {
    if (isCurrentUser) return
    setLoading(true)
    async function fetchFollowingDoc() {
      try {
        const followingDoc = await getFollowingDoc(profile.id)
        if (followingDoc && followingDoc.exists) {
          dispatch(setFollowUser())
        }
      } catch (err) {
        toast.error(err.message)
      }
    }
    fetchFollowingDoc().then(() => setLoading(false))
    return () => {
      dispatch({ type: CLEAR_FOLLOWINGS })
    }
  }, [dispatch, profile.id, isCurrentUser])

  async function handleFollowUser() {
    setLoading(true)
    try {
      await followUser(profile)
      dispatch(setFollowUser())
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }
  async function handleUnfollowUser() {
    setLoading(true)
    try {
      await unfollowUser(profile)
      dispatch(setUnfollowUser())
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Segment>
      <Grid>
        <Grid.Column width={10}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={profile.photoURL || DefaultUserAvatar}
              />
              <Item.Content verticalAlign='middle'>
                <Header
                  as='h1'
                  style={{ display: "block", marginBottom: 10 }}
                  content={profile.displayName}
                />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={6}>
          <Statistic.Group>
            <Statistic color='pink'>
              <Statistic.Value>
                <Icon name='users' size='small' />
                {profile.followerCount || 0}
              </Statistic.Value>
              <Statistic.Label>
                {profile.followerCount.length > 1 ? "Followers" : "Follower"}
              </Statistic.Label>
            </Statistic>
            <Statistic color='violet'>
              <Statistic.Value>
                <Icon name='beer' size='small' />
                {profile.followingCount || 0}
              </Statistic.Value>
              <Statistic.Label>Following</Statistic.Label>
            </Statistic>
          </Statistic.Group>
          {!isCurrentUser && (
            <>
              <Divider />
              <Reveal animated='move'>
                <Reveal.Content visible style={{ width: "100%" }}>
                  <Button
                    fluid
                    color={followingUser ? "green" : "blue"}
                    content={followingUser ? "Following" : "Follow"}
                  />
                </Reveal.Content>
                <Reveal.Content hidden style={{ width: "100%" }}>
                  <Button
                    fluid
                    color={followingUser ? "red" : "green"}
                    loading={loading}
                    onClick={
                      followingUser
                        ? () => handleUnfollowUser()
                        : () => handleFollowUser()
                    }
                    content={followingUser ? "Unfollow" : "Follow"}
                  />
                </Reveal.Content>
              </Reveal>
            </>
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default ProfileHeader
