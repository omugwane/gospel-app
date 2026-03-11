'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { usePreferences } from '@/components/preferences-context'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const a = parts[0]?.[0] ?? 'U'
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
  return `${a}${b}`.toUpperCase()
}

export default function AccountPreferencesClient() {
  const { user, language, theme, setLanguage, setTheme, languageOptions } = usePreferences()
  const displayName = user?.name?.trim() || 'Guest'
  const fallback = initials(displayName)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          Account
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your profile and preferences.
        </p>
      </div>

      <section className="rounded-2xl border border-card-border bg-card-bg p-5">
        <h2 className="text-sm font-semibold text-heading">User Profile</h2>
        <p className="mt-1 text-xs text-muted">
          Your account information and display name.
        </p>

        <div className="mt-4 flex items-center gap-4">
          <AvatarPrimitive.Root className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-1 ring-border-default">
            {user?.avatarUrl ? (
              <AvatarPrimitive.Image
                className="aspect-square h-full w-full object-cover"
                src={user.avatarUrl}
                alt={displayName}
              />
            ) : null}
            <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-muted-bg-strong text-heading text-xl font-semibold">
              {fallback}
            </AvatarPrimitive.Fallback>
          </AvatarPrimitive.Root>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-heading truncate">{displayName}</p>
            {user?.email ? (
              <p className="mt-0.5 text-xs text-muted truncate">{user.email}</p>
            ) : (
              <p className="mt-0.5 text-xs text-muted">Sign in to sync your profile</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-card-border bg-card-bg p-5">
        <h2 className="text-sm font-semibold text-heading">Theme</h2>
        <p className="mt-1 text-xs text-muted">
          Choose how the app looks on your device.
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {(['light', 'dark', 'system'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold capitalize transition-colors ${
                theme === option
                  ? 'border-primary-500 bg-primary-solid text-primary-solid-fg'
                  : 'border-card-border bg-card-bg-solid text-heading'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-card-border bg-card-bg p-5">
        <h2 className="text-sm font-semibold text-heading">Language</h2>
        <p className="mt-1 text-xs text-muted">
          Set your preferred language for this app session.
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {languageOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => setLanguage(option.code)}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                language === option.code
                  ? 'border-primary-500 bg-primary-solid text-primary-solid-fg'
                  : 'border-card-border bg-card-bg-solid text-heading'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
