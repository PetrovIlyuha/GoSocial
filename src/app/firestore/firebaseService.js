import { toast } from "react-toastify"
import firebase from "../config/firebase"
import { setUserProfileData } from "./firestoreService"

export function firebaseObjectToArray(snapshot) {
  if (snapshot) {
    return Object.entries(snapshot).map(e =>
      Object.assign({}, e[1], { id: e[0] })
    )
  }
}

export function signInWithEmailAndPassword(credentials) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(credentials.email, credentials.password)
}

export function signOutFirebaseUser() {
  return firebase.auth().signOut()
}

export async function registerOnFirebase(credentials) {
  try {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
    await result.user.updateProfile({
      displayName: credentials.username,
    })
    return await setUserProfileData(result.user)
  } catch (err) {
    throw new Error(err)
  }
}

export async function socialLogin(selectedProvider) {
  let provider
  if (selectedProvider === "facebook") {
    provider = new firebase.auth.FacebookAuthProvider()
  }
  if (selectedProvider === "google") {
    provider = new firebase.auth.GoogleAuthProvider()
  }
  try {
    const result = await firebase.auth().signInWithPopup(provider)
    if (result.additionalUserInfo.isNewUser) {
      await setUserProfileData(result.user)
    }
  } catch (error) {
    toast.error(error.message)
  }
}

export function updateUserPassword(credentials) {
  const user = firebase.auth().currentUser
  return user.updatePassword(credentials.newPassword1)
}

export function uploadToFirebaseStorage(file, filename) {
  const user = firebase.auth().currentUser
  const storageRef = firebase.storage().ref()
  return storageRef.child(`${user.uid}/user_images/${filename}`).put(file)
}

export function deleteFromFirebaseStorage(filename) {
  const user = firebase.auth().currentUser
  const storageRef = firebase.storage().ref()
  const photoRef = storageRef.child(`${user.uid}/user_images/${filename}`)
  return photoRef.delete()
}

export function addEventChatComment(eventId, { comment, parentId }) {
  const user = firebase.auth().currentUser
  const newComment = {
    displayName: user.displayName,
    photoURL: user.photoURL,
    uid: user.uid,
    text: comment,
    date: Date.now(),
    parentId: parentId,
  }
  return firebase.database().ref(`chat/${eventId}`).push(newComment)
}

export function getEventChatRef(eventId) {
  return firebase.database().ref(`chat/${eventId}`).orderByKey()
}
