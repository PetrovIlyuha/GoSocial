import firebase from "../config/firebase"

const db = firebase.firestore()

export function dataFromSnapshot(snapshot) {
  if (!snapshot.exists) {
    return undefined
  }
  const data = snapshot.data()

  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof firebase.firestore.Timestamp) {
        data[prop] = data[prop].toDate()
      }
    }
  }
  return {
    ...data,
    id: snapshot.id,
  }
}

export function listenToEventsFromFireStore(predicate) {
  const user = firebase.auth().currentUser
  let eventsRef = db.collection("events").orderBy("date")
  switch (predicate.get("filter")) {
    case "isGoing":
      return eventsRef
        .where("attendeeIds", "array-contains", user.uid)
        .where("date", ">=", predicate.get("startDate"))
    case "isHosting":
      return eventsRef
        .where("hostUid", "==", user.uid)
        .where("date", ">=", predicate.get("startDate"))
    default:
      return eventsRef.where("date", ">=", predicate.get("startDate"))
  }
}

export function listenToEventFromFirestore(eventId) {
  return db.collection("events").doc(eventId)
}

export async function addEventToFirestore(event) {
  const user = await firebase.auth().currentUser
  return db.collection("events").add({
    ...event,
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: user.photoURL || null,
    attendees: firebase.firestore.FieldValue.arrayUnion({
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL || null,
    }),
    attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid),
  })
}

export function updateEventInFirestore(event) {
  return db.collection("events").doc(event.id).update(event)
}

export function deleteEventInFirestore(event) {
  return db.collection("events").doc(event).delete()
}

export function cancelEventToggle(event) {
  return db.collection("events").doc(event.id).update({
    isCancelled: !event.isCancelled,
  })
}

export function setUserProfileData(user) {
  return db
    .collection("users")
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      email: user.email,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL: user.photoURL || null,
    })
}

export function getUserProfile(userId) {
  return db.collection("users").doc(userId)
}

export async function updateUserProfile(profile) {
  const user = firebase.auth().currentUser
  try {
    await user.updateProfile({
      displayName: profile.displayName,
      description: profile.description,
    })
    return await db.collection("users").doc(user.uid).update(profile)
  } catch (err) {
    throw err
  }
}

export async function updateUserProfilePhoto(downloadURL, filename) {
  const user = firebase.auth().currentUser
  const userDocRef = db.collection("users").doc(user.uid)
  try {
    const userDoc = await userDocRef.get()
    if (!userDoc.data().photoURL) {
      await db
        .collection("users")
        .doc(user.uid)
        .update({ photoURL: downloadURL })
      await user.updateProfile({
        photoURL: downloadURL,
      })
    }
    return await db.collection("users").doc(user.uid).collection("photos").add({
      name: filename,
      url: downloadURL,
    })
  } catch (error) {
    throw error
  }
}

export const getUserPhotos = userUid => {
  return db.collection("users").doc(userUid).collection("photos")
}

export const setMainPhoto = async photo => {
  const user = firebase.auth().currentUser
  try {
    await db.collection("users").doc(user.uid).update({ photoURL: photo.url })
    return await user.updateProfile({ photoURL: photo.url })
  } catch (err) {
    throw err
  }
}

export function deletePhotoFromCollection(photoId) {
  const userUid = firebase.auth().currentUser.uid
  return db
    .collection("users")
    .doc(userUid)
    .collection("photos")
    .doc(photoId)
    .delete()
}

export function addUserAttendance(event) {
  const user = firebase.auth().currentUser
  return db
    .collection("events")
    .doc(event.id)
    .update({
      attendees: firebase.firestore.FieldValue.arrayUnion({
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL || null,
      }),
      attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid),
    })
}

export async function cancelUserAttendance(event) {
  const user = firebase.auth().currentUser
  try {
    const eventDoc = await db.collection("events").doc(event.id).get()
    return db
      .collection("events")
      .doc(event.id)
      .update({
        attendeeIds: firebase.firestore.FieldValue.arrayRemove(user.uid),
        attendees: eventDoc
          .data()
          .attendees.filter(attendee => attendee.id !== user.uid),
      })
  } catch (err) {
    console.error(`From cancel event`, err)
    throw err
  }
}

export function getUserEventsQuery(activeTab, userUid) {
  let eventsRef = db.collection("events")
  const today = new Date()
  switch (activeTab) {
    case 1:
      return eventsRef
        .where("attendeeIds", "array-contains", userUid)
        .where("date", "<=", today)
        .orderBy("date", "desc")
    case 2: // hosting
      return eventsRef.where("hostUid", "==", userUid).orderBy("date")
    default:
      return eventsRef
        .where("attendeeIds", "array-contains", userUid)
        .where("date", ">=", today)
        .orderBy("date")
  }
}

export async function followUser(profile) {
  const user = firebase.auth().currentUser
  const batch = db.batch()
  try {
    batch.set(
      db
        .collection("following")
        .doc(user.uid)
        .collection("userFollowing")
        .doc(profile.id),
      {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        uid: profile.id,
      }
    )
    batch.update(db.collection("users").doc(user.uid), {
      followingCount: firebase.firestore.FieldValue.increment(1),
    })
    return await batch.commit()
  } catch (err) {
    throw err
  }
}

export async function unfollowUser(profile) {
  const user = firebase.auth().currentUser
  const batch = db.batch()
  try {
    batch.delete(
      db
        .collection("following")
        .doc(user.uid)
        .collection("userFollowing")
        .doc(profile.id)
    )
    batch.update(db.collection("users").doc(user.uid), {
      followingCount: firebase.firestore.FieldValue.increment(-1),
    })
    return await batch.commit()
  } catch (err) {
    throw err
  }
}

export function getFollowersCollection(profileId) {
  return db.collection("following").doc(profileId).collection("userFollowers")
}

export function getFollowingCollection(profileId) {
  return db.collection("following").doc(profileId).collection("userFollowing")
}

export function getFollowingDoc(profileId) {
  const userUid = firebase.auth().currentUser.uid
  return db
    .collection("following")
    .doc(userUid)
    .collection("userFollowing")
    .doc(profileId)
    .get()
}
