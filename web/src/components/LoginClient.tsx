'use client'

import { useState, useSyncExternalStore } from 'react'
import { useAuth } from '@/components/auth-context'

function subscribeToOnlineStatus(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getOnlineSnapshot() {
  return typeof navigator === 'undefined' ? true : navigator.onLine
}

function getOnlineServerSnapshot() {
  return true
}

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.4-1.7 4.1-5.4 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.6 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12s4.2 9.3 9.3 9.3c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.6H12z"
      />
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.2 1.4-1.7 4.1-5.4 4.1v.1l4.5 3.5h.1c2.7-2.5 4-6.1 4-10z"
      />
      <path
        fill="#FBBC05"
        d="M5.7 14.3a5.5 5.5 0 0 1 0-4.6L2.7 7.3a9.3 9.3 0 0 0 0 9.4l3-3z"
      />
      <path
        fill="#34A853"
        d="M12 21.3c2.6 0 4.7-.9 6.3-2.3l-4.5-3.5c-.7.5-1.7.9-3 .9-2.3 0-4.3-1.5-5-3.6L2.7 16.7A9.3 9.3 0 0 0 12 21.3z"
      />
    </svg>
  )
}

export default function LoginClient() {
  const { user, status, error, isConfigured, signInWithGoogle, clearError } =
    useAuth()
  const [submitting, setSubmitting] = useState(false)
  const isOnline = useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineSnapshot,
    getOnlineServerSnapshot
  )

  const disabled =
    !isConfigured ||
    !isOnline ||
    submitting ||
    status === 'loading' ||
    Boolean(user)

  const handleSignIn = async () => {
    if (disabled) return
    setSubmitting(true)
    clearError()
    try {
      await signInWithGoogle()
    } catch {
      // Pop-up blocked / redirect failed before navigation — allow retry.
    } finally {
      setSubmitting(false)
    }
  }

  const buttonLabel = (() => {
    if (user) return 'Signed in'
    if (submitting) return 'Signing in…'
    if (status === 'loading') return 'Loading…'
    return 'Continue with Google'
  })()

  return (
    <main className="min-h-[100dvh] flex items-center justify-center bg-page-bg px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-heading">
            Welcome to Senga
          </h1>
          <p className="text-sm text-muted">
            Sign in with your Google account to continue.
          </p>
        </div>

        {!isConfigured ? (
          <div className="mt-5 rounded-xl border border-card-border bg-card-bg-solid px-3 py-2 text-xs text-muted">
            Authentication is not configured for this environment yet.
          </div>
        ) : null}

        {!isOnline ? (
          <div className="mt-5 rounded-xl border border-card-border bg-card-bg-solid px-3 py-2 text-xs text-muted">
            You appear to be offline. Reconnect to sign in with Google.
          </div>
        ) : null}

        {error ? (
          <div className="mt-5 rounded-xl border border-card-border bg-card-bg-solid px-3 py-2">
            <p className="text-xs text-muted">{error}</p>
            <button
              type="button"
              onClick={clearError}
              className="mt-2 rounded-xl border border-card-border bg-card-bg-solid px-3 py-1.5 text-xs font-semibold text-heading transition-colors"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => {
            void handleSignIn()
          }}
          disabled={disabled}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary-500 bg-primary-solid px-4 py-3 text-sm font-semibold text-primary-solid-fg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleMark />
          {buttonLabel}
        </button>

        <p className="mt-4 text-center text-[11px] text-muted">
          We only use your Google account to identify you. No password needed.
        </p>
      </div>
    </main>
  )
}
