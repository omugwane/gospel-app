import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
}

let hasWarnedMissingConfig = false
let firestoreInstance: Firestore | null | undefined

function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every((value) => value.trim().length > 0)
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseConfig()) {
    if (!hasWarnedMissingConfig) {
      hasWarnedMissingConfig = true
      console.warn(
        '[firebase] Firebase env vars are incomplete. ' +
          'Auth and Firestore will be unavailable until Firebase is configured.'
      )
    }
    return null
  }

  if (getApps().length > 0) {
    return getApp()
  }

  return initializeApp(firebaseConfig)
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp()
  if (!app) {
    return null
  }

  return getAuth(app)
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp()
  if (!app) {
    return null
  }

  if (firestoreInstance !== undefined) {
    return firestoreInstance
  }

  firestoreInstance = getFirestore(app)
  return firestoreInstance
}

export function isFirebaseConfigured() {
  return hasFirebaseConfig()
}
