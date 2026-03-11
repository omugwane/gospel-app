/**
 * Firebase service layer.
 *
 * All Firestore reads/writes should go through functions exported
 * from this module (or domain-specific modules that import it).
 * This ensures that when offline persistence is enabled, the
 * cache behaviour applies uniformly.
 *
 * ---------------------------------------------------------------
 * OFFLINE PERSISTENCE (enable after Firebase SDK is installed):
 *
 *   import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
 *
 *   const db = getFirestore(app)
 *   enableIndexedDbPersistence(db).catch((err) => {
 *     if (err.code === 'failed-precondition') {
 *       // Multiple tabs open — persistence can only be enabled in one.
 *     } else if (err.code === 'unimplemented') {
 *       // Browser does not support IndexedDB persistence.
 *     }
 *   })
 *
 * ---------------------------------------------------------------
 * FCM PUSH NOTIFICATIONS (enable after service worker is set up):
 *
 *   import { getMessaging, getToken, onMessage } from 'firebase/messaging'
 *
 *   const messaging = getMessaging(app)
 *   const token = await getToken(messaging, { vapidKey: '...' })
 *   // Store token in Firestore under the user's devices collection
 *
 * ---------------------------------------------------------------
 */

export {}
