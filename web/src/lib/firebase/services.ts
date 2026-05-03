import type { User } from 'firebase/auth'
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type DocumentReference,
} from 'firebase/firestore'
import type { UiLanguage, UiTheme } from '@/components/preferences-context'
import { getFirebaseDb } from '@/lib/firebase/client'
import { Collections } from '@/lib/firebase/collections'

export interface FirebaseUserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  preferredLanguage?: UiLanguage
  preferredTheme?: UiTheme
}

type UserProfileDocument = Omit<FirebaseUserProfile, 'uid'> & {
  createdAt?: unknown
  updatedAt?: unknown
}

function getUserProfileRef(uid: string): DocumentReference<UserProfileDocument> | null {
  const db = getFirebaseDb()
  if (!db) {
    return null
  }

  return doc(db, Collections.users, uid) as DocumentReference<UserProfileDocument>
}

function isLanguage(value: unknown): value is UiLanguage {
  return value === 'rw' || value === 'en' || value === 'fr'
}

function isTheme(value: unknown): value is UiTheme {
  return value === 'light' || value === 'dark' || value === 'system'
}

function normalizeUserProfile(uid: string, value: unknown): FirebaseUserProfile | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const record = value as Record<string, unknown>

  return {
    uid,
    email: typeof record.email === 'string' ? record.email : null,
    displayName: typeof record.displayName === 'string' ? record.displayName : null,
    photoURL: typeof record.photoURL === 'string' ? record.photoURL : null,
    preferredLanguage: isLanguage(record.preferredLanguage) ? record.preferredLanguage : undefined,
    preferredTheme: isTheme(record.preferredTheme) ? record.preferredTheme : undefined,
  }
}

export async function ensureFirebaseUserProfile(user: User): Promise<FirebaseUserProfile | null> {
  const ref = getUserProfileRef(user.uid)
  if (!ref) {
    return null
  }

  const baseProfile: UserProfileDocument = {
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
  }

  await setDoc(
    ref,
    {
      ...baseProfile,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  )

  const snapshot = await getDoc(ref)
  return normalizeUserProfile(user.uid, snapshot.data()) ?? { uid: user.uid, ...baseProfile }
}

export async function getFirebaseUserProfile(uid: string): Promise<FirebaseUserProfile | null> {
  const ref = getUserProfileRef(uid)
  if (!ref) {
    return null
  }

  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) {
    return null
  }

  return normalizeUserProfile(uid, snapshot.data())
}

export async function updateFirebaseUserPreferences(
  uid: string,
  preferences: {
    preferredLanguage?: UiLanguage
    preferredTheme?: UiTheme
  }
): Promise<void> {
  const ref = getUserProfileRef(uid)
  if (!ref) {
    return
  }

  await setDoc(
    ref,
    {
      ...preferences,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
