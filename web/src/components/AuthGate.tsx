'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth-context'

const LOGIN_PATH = '/login'
const STUDIO_PREFIX = '/studio'

function isStudioPath(pathname: string) {
  return pathname === STUDIO_PREFIX || pathname.startsWith(`${STUDIO_PREFIX}/`)
}

function isSafeNextPath(value: string | null | undefined) {
  if (!value) return false
  if (!value.startsWith('/')) return false
  if (value.startsWith('//')) return false
  return true
}

function FullScreenAuthState({ message }: { message: string }) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-page-bg px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className="h-8 w-8 rounded-full border-2 border-card-border border-t-primary-500 animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-muted">{message}</p>
      </div>
    </div>
  )
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/'
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status, user, isConfigured } = useAuth()

  const onLoginPath = pathname === LOGIN_PATH
  const onStudioPath = isStudioPath(pathname)

  useEffect(() => {
    if (onStudioPath) return
    if (status !== 'ready') return

    if (!user && !onLoginPath) {
      const queryString = searchParams?.toString() ?? ''
      const fullPath = queryString ? `${pathname}?${queryString}` : pathname
      const target = `${LOGIN_PATH}?next=${encodeURIComponent(fullPath)}`
      router.replace(target)
      return
    }

    if (user && onLoginPath) {
      const nextParam = searchParams?.get('next') ?? null
      const safeNext = isSafeNextPath(nextParam) ? (nextParam as string) : '/'
      router.replace(safeNext)
    }
  }, [
    onLoginPath,
    onStudioPath,
    pathname,
    router,
    searchParams,
    status,
    user,
  ])

  if (onStudioPath) {
    return <>{children}</>
  }

  if (!isConfigured && !onLoginPath) {
    return (
      <FullScreenAuthState message="Authentication is not configured for this environment." />
    )
  }

  if (status === 'loading') {
    return <FullScreenAuthState message="Restoring your session…" />
  }

  if (onLoginPath) {
    if (user) {
      return <FullScreenAuthState message="Signing you in…" />
    }
    return <>{children}</>
  }

  if (!user) {
    return <FullScreenAuthState message="Redirecting to sign in…" />
  }

  return <>{children}</>
}
