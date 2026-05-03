'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-context'
import AppShell from '@/product/shell/components/AppShell'
import {
  PreferencesProvider,
  type UiLanguage,
  type UiTheme,
  type UserProfile,
} from '@/components/preferences-context'
import {
  ensureFirebaseUserProfile,
  updateFirebaseUserPreferences,
  type FirebaseUserProfile,
} from '@/lib/firebase/services'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Library', href: '/library' },
  { label: 'Plans', href: '/plans' },
  { label: 'Fellowship', href: '/fellowship' },
  { label: 'Giving', href: '/giving' },
]

const LANGUAGE_OPTIONS: Array<{ code: UiLanguage; label: string }> = [
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
]

const STORAGE_KEYS = {
  language: 'senga-preferred-language',
  theme: 'senga-preferred-theme',
} as const

function isLanguage(value: string): value is UiLanguage {
  return value === 'rw' || value === 'en' || value === 'fr'
}

function isTheme(value: string): value is UiTheme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { status, user, signOutUser } = useAuth()

  const [language, setLanguage] = useState<UiLanguage>(() => {
    if (typeof window === 'undefined') {
      return 'rw'
    }

    const savedLanguage = window.localStorage.getItem(STORAGE_KEYS.language)
    return savedLanguage && isLanguage(savedLanguage) ? savedLanguage : 'rw'
  })
  const [theme, setTheme] = useState<UiTheme>(() => {
    if (typeof window === 'undefined') {
      return 'system'
    }

    const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme)
    return savedTheme && isTheme(savedTheme) ? savedTheme : 'system'
  })
  const [firebaseProfile, setFirebaseProfile] = useState<FirebaseUserProfile | null>(null)
  const hasLoadedTheme = useRef(false)
  const hasLoadedRemotePreferences = useRef(status === 'ready' && !user)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.language, language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const applyTheme = (nextTheme: UiTheme) => {
      const root = document.documentElement
      const shouldUseDark =
        nextTheme === 'dark' ||
        (nextTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

      root.classList.toggle('dark', shouldUseDark)
    }

    applyTheme(theme)

    if (!hasLoadedTheme.current) {
      hasLoadedTheme.current = true
    } else {
      window.localStorage.setItem(STORAGE_KEYS.theme, theme)
    }

    if (theme !== 'system') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])

  useEffect(() => {
    let isCurrent = true

    if (status !== 'ready') {
      return undefined
    }

    if (!user) {
      hasLoadedRemotePreferences.current = true
      return undefined
    }

    hasLoadedRemotePreferences.current = false

    void ensureFirebaseUserProfile(user)
      .then((profile) => {
        if (!isCurrent) {
          return
        }

        setFirebaseProfile(profile)

        if (profile?.preferredLanguage) {
          setLanguage(profile.preferredLanguage)
        }

        if (profile?.preferredTheme) {
          setTheme(profile.preferredTheme)
        }

        hasLoadedRemotePreferences.current = true
      })
      .catch(() => {
        if (!isCurrent) {
          return
        }

        setFirebaseProfile({
          uid: user.uid,
          email: user.email ?? null,
          displayName: user.displayName ?? null,
          photoURL: user.photoURL ?? null,
        })
        hasLoadedRemotePreferences.current = true
      })

    return () => {
      isCurrent = false
    }
  }, [status, user])

  useEffect(() => {
    if (!user || !hasLoadedRemotePreferences.current) {
      return
    }

    void updateFirebaseUserPreferences(user.uid, {
      preferredLanguage: language,
      preferredTheme: theme,
    })
  }, [language, theme, user])

  const navigationItems = NAV_ITEMS.map((item) => ({
    ...item,
    isActive:
      item.href === '/'
        ? pathname === '/' || pathname.startsWith('/home')
        : pathname.startsWith(item.href),
  }))

  const preferenceUser: UserProfile = useMemo(
    () => ({
      name: user
        ? firebaseProfile?.displayName?.trim() ||
          user.displayName?.trim() ||
          user.email?.trim() ||
          'User'
        : 'Guest',
      avatarUrl: user ? firebaseProfile?.photoURL ?? user.photoURL ?? undefined : undefined,
      email: user ? firebaseProfile?.email ?? user.email ?? undefined : undefined,
    }),
    [firebaseProfile, user]
  )

  const preferencesValue = useMemo(
    () => ({
      user: preferenceUser,
      language,
      theme,
      setLanguage,
      setTheme,
      languageOptions: LANGUAGE_OPTIONS,
    }),
    [language, preferenceUser, theme]
  )

  return (
    <PreferencesProvider value={preferencesValue}>
      <AppShell
        navigationItems={navigationItems}
        user={preferenceUser}
        onNavigate={(href) => router.push(href)}
        onLogout={() => {
          setFirebaseProfile(null)
          hasLoadedRemotePreferences.current = true
          void signOutUser().finally(() => {
            router.replace('/login')
          })
        }}
        onOpenAccount={() => router.push('/account')}
      >
        {children}
      </AppShell>
    </PreferencesProvider>
  )
}
