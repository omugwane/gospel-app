import Link from 'next/link'
import ShellLayout from '@/components/ShellLayout'

export default function NotFound() {
  return (
    <ShellLayout>
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div
          className="rounded-2xl border p-8"
          style={{
            borderColor: 'var(--status-failed-border)',
            backgroundColor: 'var(--status-failed-bg)',
          }}
        >
          <h1
            className="text-lg font-semibold"
            style={{ color: 'var(--status-failed-text)' }}
          >
            Page not found
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--primary-solid)',
              color: 'var(--primary-solid-foreground)',
            }}
          >
            Go home
          </Link>
        </div>
      </div>
    </ShellLayout>
  )
}
