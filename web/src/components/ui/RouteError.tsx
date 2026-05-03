'use client'

import { useRouter } from 'next/navigation'

interface RouteErrorProps {
  /** Error message to display */
  message?: string
  /** Callback to retry (e.g. reset from error boundary) */
  onRetry?: () => void
  /** Whether to show a back button */
  showBack?: boolean
}

export default function RouteError({
  message = 'Something went wrong.',
  onRetry,
  showBack = true,
}: RouteErrorProps) {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      <div
        className="rounded-2xl border p-8"
        style={{
          borderColor: 'var(--status-failed-border)',
          backgroundColor: 'var(--status-failed-bg)',
        }}
      >
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--status-failed-text)' }}
        >
          {message}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--primary-solid)',
                color: 'var(--primary-solid-foreground)',
              }}
            >
              Try again
            </button>
          )}
          {showBack && (
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-body)',
              }}
            >
              Go home
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
