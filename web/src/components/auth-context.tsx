'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase/client'

type AuthStatus = 'loading' | 'ready'

interface AuthContextValue {
  status: AuthStatus
  user: User | null
  error: string | null
  isConfigured: boolean
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return 'Authentication is unavailable right now.'
}

function getFirebaseErrorCode(error: unknown): string | null {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code
    return typeof code === 'string' ? code : null
  }
  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(() =>
    isFirebaseConfigured() ? 'loading' : 'ready'
  )
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  const configured = isFirebaseConfigured()

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      return undefined
    }

    let cancelled = false
    let unsubscribe: () => void = () => {}

    void (async () => {
      try {
        // Consume any pending redirect before other auth initialization (PWA / non-localhost).
        await getRedirectResult(auth)
      } catch (redirectError) {
        if (!cancelled) {
          setError(getAuthErrorMessage(redirectError))
        }
      }

      try {
        await setPersistence(auth, browserLocalPersistence)
      } catch (persistenceError) {
        console.warn('[auth] Failed to set local persistence', persistenceError)
      }

      if (cancelled) {
        return
      }

      unsubscribe = onAuthStateChanged(
        auth,
        (nextUser) => {
          setUser(nextUser)
          setStatus('ready')
        },
        (nextError) => {
          setError(getAuthErrorMessage(nextError))
          setUser(null)
          setStatus('ready')
        }
      )
    })()

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      isConfigured: configured,
      signInWithGoogle: async () => {
        const auth = getFirebaseAuth()
        if (!auth) {
          setError('Firebase is not configured yet for this environment.')
          return
        }

        setError(null)

        try {
          await setPersistence(auth, browserLocalPersistence)
        } catch (persistenceError) {
          console.warn('[auth] Failed to set local persistence', persistenceError)
        }

        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })

        // Redirect sign-in often fails on localhost (callback URL / handler mismatch with this app).
        // Pop-up completes in-page; keep redirect for deployed / PWA origins.
        const preferPopup =
          typeof window !== 'undefined' &&
          (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1')

        try {
          if (preferPopup) {
            try {
              await signInWithPopup(auth, provider)
              return
            } catch (popupError) {
              const code = getFirebaseErrorCode(popupError)
              if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
                await signInWithRedirect(auth, provider)
                return
              }
              throw popupError
            }
          }

          await signInWithRedirect(auth, provider)
        } catch (nextError) {
          setError(getAuthErrorMessage(nextError))
          throw nextError
        }
      },
      signOutUser: async () => {
        const auth = getFirebaseAuth()
        if (!auth) {
          setUser(null)
          return
        }

        setError(null)
        try {
          await signOut(auth)
        } catch (nextError) {
          setError(getAuthErrorMessage(nextError))
          throw nextError
        }
      },
      clearError: () => setError(null),
    }),
    [configured, error, status, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
