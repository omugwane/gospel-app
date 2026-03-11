/**
 * Firebase client stub.
 *
 * Owns: auth, user profile, locale preference, plan progress,
 * saved items, downloads metadata, prayer commitments, testimonies,
 * counseling requests, device registration, notification preferences.
 *
 * Replace these placeholders with real values once your
 * Firebase project is created.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
}

/**
 * Initialize Firebase lazily.
 *
 * Call this once at app startup. The actual `firebase/app` import
 * is deferred until the SDK packages are installed:
 *
 *   npm install firebase
 *
 * Until then this function is a no-op stub.
 */
export function getFirebaseApp() {
  if (!firebaseConfig.apiKey) {
    console.warn(
      '[firebase] NEXT_PUBLIC_FIREBASE_API_KEY is not set. ' +
        'Auth and Firestore will be unavailable until Firebase is configured.'
    )
    return null
  }

  return null
}
