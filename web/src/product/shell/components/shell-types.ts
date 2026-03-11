export type LanguageCode = 'rw' | 'en' | 'fr'

export interface LanguageOption {
  code: LanguageCode
  label: string
}

export interface ShellTranslations {
  productName?: string
  subtitle?: string
  mobileSubtitle?: string
  offlineTitle?: string
  offlineDescription?: string
  userMenu?: {
    signedInAs: string
    account: string
    logout: string
    ariaLabel: string
    languageLabel?: string
  }
}

export const DEFAULT_SHELL_TRANSLATIONS: ShellTranslations = {
  productName: 'Senga App',
  subtitle: 'Distraction-free teachings',
  mobileSubtitle: 'Daily verse • Audio • Fellowship',
  offlineTitle: 'Offline-first',
  offlineDescription: 'Save a short audio + verse on Wi‑Fi, listen later without data.',
  userMenu: {
    signedInAs: 'Signed in as',
    account: 'Account',
    logout: 'Logout',
    ariaLabel: 'User menu',
    languageLabel: 'Language',
  },
}
