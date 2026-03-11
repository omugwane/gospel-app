'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AppShell from '@/product/shell/components/AppShell'
import {
  PreferencesProvider,
  type UiLanguage,
  type UiTheme,
} from '@/components/preferences-context'

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

  const [language, setLanguage] = useState<UiLanguage>('rw')
  const [theme, setTheme] = useState<UiTheme>('system')

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEYS.language)
    if (savedLanguage && isLanguage(savedLanguage)) {
      setLanguage(savedLanguage)
    }

    const savedTheme = window.localStorage.getItem(STORAGE_KEYS.theme)
    if (savedTheme && isTheme(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.language, language)
    document.documentElement.lang = language
  }, [language])

  const hasLoadedTheme = useRef(false)

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

  const navigationItems = NAV_ITEMS.map((item) => ({
    ...item,
    isActive:
      item.href === '/'
        ? pathname === '/' || pathname.startsWith('/home')
        : pathname.startsWith(item.href),
  }))

  const preferencesValue = useMemo(
    () => ({
      user: { name: 'Guest' },
      language,
      theme,
      setLanguage,
      setTheme,
      languageOptions: LANGUAGE_OPTIONS,
    }),
    [language, theme]
  )

  return (
    <PreferencesProvider value={preferencesValue}>
      <AppShell
        navigationItems={navigationItems}
        user={{ name: 'Guest' }}
        onNavigate={(href) => router.push(href)}
        onLogout={() => {}}
        onOpenAccount={() => router.push('/account')}
      >
        {children}
      </AppShell>
    </PreferencesProvider>
  )
}
