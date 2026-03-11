'use client'

import { createContext, useContext } from 'react'

export type UiLanguage = 'rw' | 'en' | 'fr'
export type UiTheme = 'light' | 'dark' | 'system'

export interface UserProfile {
  name: string
  avatarUrl?: string
  email?: string
}

export interface PreferencesContextValue {
  user?: UserProfile
  language: UiLanguage
  theme: UiTheme
  languageOptions: Array<{ code: UiLanguage; label: string }>
  setLanguage: (language: UiLanguage) => void
  setTheme: (theme: UiTheme) => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({
  value,
  children,
}: {
  value: PreferencesContextValue
  children: React.ReactNode
}) {
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }
  return ctx
}
