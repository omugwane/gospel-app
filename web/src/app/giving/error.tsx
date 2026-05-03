'use client'

import { useEffect } from 'react'
import ShellLayout from '@/components/ShellLayout'
import RouteError from '@/components/ui/RouteError'
import { isBenignAbortError } from '@/lib/isBenignAbortError'

export default function GivingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isAbort = isBenignAbortError(error)

  useEffect(() => {
    if (isAbort) {
      reset()
      return
    }
    console.error(error)
  }, [error, isAbort, reset])

  if (isAbort) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-page-bg px-6">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    )
  }

  return (
    <ShellLayout>
      <RouteError
        message={error.message || 'Failed to load giving.'}
        onRetry={reset}
        showBack
      />
    </ShellLayout>
  )
}
