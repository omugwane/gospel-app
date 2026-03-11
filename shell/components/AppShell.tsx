import type { ShellTranslations } from './shell-types'
import { DEFAULT_SHELL_TRANSLATIONS } from './shell-types'
import MainNav, { type NavigationItem } from './MainNav'
import UserMenu from './UserMenu'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

interface AppShellProps {
  children: React.ReactNode
  navigationItems: Array<{ label: string; href: string; isActive?: boolean }>
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
  translations?: Partial<ShellTranslations>
  locale?: string
  languageOptions?: Array<{ code: string; label: string }>
  onChangeLocale?: (locale: string) => void
}

type Accent = {
  activeBg: string
  activeText: string
  activeIcon: string
  hoverBg: string
  idleText: string
  idleIcon: string
}

function accentFor(primary?: string, neutral?: string): Accent {
  const p = (primary ?? 'violet').toLowerCase()
  const n = (neutral ?? 'stone').toLowerCase()

  const primaryMap: Record<string, Pick<Accent, 'activeBg' | 'activeText' | 'activeIcon'>> = {
    violet: {
      activeBg: 'bg-violet-600/10 dark:bg-violet-400/10',
      activeText: 'text-violet-800 dark:text-violet-200',
      activeIcon: 'text-violet-700 dark:text-violet-200',
    },
    indigo: {
      activeBg: 'bg-indigo-600/10 dark:bg-indigo-400/10',
      activeText: 'text-indigo-800 dark:text-indigo-200',
      activeIcon: 'text-indigo-700 dark:text-indigo-200',
    },
    blue: {
      activeBg: 'bg-blue-600/10 dark:bg-blue-400/10',
      activeText: 'text-blue-800 dark:text-blue-200',
      activeIcon: 'text-blue-700 dark:text-blue-200',
    },
    emerald: {
      activeBg: 'bg-emerald-600/10 dark:bg-emerald-400/10',
      activeText: 'text-emerald-800 dark:text-emerald-200',
      activeIcon: 'text-emerald-700 dark:text-emerald-200',
    },
    teal: {
      activeBg: 'bg-teal-600/10 dark:bg-teal-400/10',
      activeText: 'text-teal-800 dark:text-teal-200',
      activeIcon: 'text-teal-700 dark:text-teal-200',
    },
    amber: {
      activeBg: 'bg-amber-500/15 dark:bg-amber-300/10',
      activeText: 'text-amber-900 dark:text-amber-200',
      activeIcon: 'text-amber-800 dark:text-amber-200',
    },
    rose: {
      activeBg: 'bg-rose-600/10 dark:bg-rose-400/10',
      activeText: 'text-rose-800 dark:text-rose-200',
      activeIcon: 'text-rose-700 dark:text-rose-200',
    },
    lime: {
      activeBg: 'bg-lime-600/10 dark:bg-lime-400/10',
      activeText: 'text-lime-900 dark:text-lime-200',
      activeIcon: 'text-lime-800 dark:text-lime-200',
    },
  }

  const neutralHoverMap: Record<string, string> = {
    slate: 'hover:bg-slate-100 dark:hover:bg-slate-900',
    gray: 'hover:bg-gray-100 dark:hover:bg-gray-900',
    zinc: 'hover:bg-zinc-100 dark:hover:bg-zinc-900',
    neutral: 'hover:bg-neutral-100 dark:hover:bg-neutral-900',
    stone: 'hover:bg-stone-100 dark:hover:bg-stone-900',
  }

  const base: Accent = {
    activeBg: primaryMap[p]?.activeBg ?? primaryMap.violet.activeBg,
    activeText: primaryMap[p]?.activeText ?? primaryMap.violet.activeText,
    activeIcon: primaryMap[p]?.activeIcon ?? primaryMap.violet.activeIcon,
    hoverBg: neutralHoverMap[n] ?? neutralHoverMap.stone,
    idleText: 'text-stone-700 dark:text-stone-200',
    idleIcon: 'text-stone-500 dark:text-stone-400',
  }

  // If neutral isn't stone, soften the idle colors slightly for that palette family.
  if (n === 'slate') {
    base.idleText = 'text-slate-700 dark:text-slate-200'
    base.idleIcon = 'text-slate-500 dark:text-slate-400'
  } else if (n === 'gray') {
    base.idleText = 'text-gray-700 dark:text-gray-200'
    base.idleIcon = 'text-gray-500 dark:text-gray-400'
  } else if (n === 'zinc') {
    base.idleText = 'text-zinc-700 dark:text-zinc-200'
    base.idleIcon = 'text-zinc-500 dark:text-zinc-400'
  } else if (n === 'neutral') {
    base.idleText = 'text-neutral-700 dark:text-neutral-200'
    base.idleIcon = 'text-neutral-500 dark:text-neutral-400'
  }

  return base
}

export default function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
  translations: translationsProp,
  locale,
  languageOptions,
  onChangeLocale,
}: AppShellProps) {
  const fonts = {
    heading: 'DM Sans',
    body: 'DM Sans',
    mono: 'IBM Plex Mono',
  }
  const colors = {
    primary: 'violet',
    secondary: 'amber',
    neutral: 'stone',
  }

  const accent = accentFor(colors.primary, colors.neutral)
  const t = { ...DEFAULT_SHELL_TRANSLATIONS, ...translationsProp }
  const title = t.productName ?? DEFAULT_SHELL_TRANSLATIONS.productName
  const navItems = navigationItems as NavigationItem[]

  return (
    <div
      className={cx(
        'min-h-screen w-full bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50',
        'selection:bg-violet-500/20 selection:text-stone-900 dark:selection:text-stone-50'
      )}
      style={{
        fontFamily: fonts.body,
      }}
    >
      <div className="min-h-screen w-full md:grid md:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:flex-col md:gap-4 md:border-r md:border-stone-200/70 md:dark:border-stone-800/70 md:bg-white/60 md:dark:bg-stone-950/60 md:backdrop-blur">
          <div className="px-5 pt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div
                  className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100 truncate"
                  style={{ fontFamily: fonts.heading }}
                >
                  {title}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 truncate">
                  {t.subtitle ?? DEFAULT_SHELL_TRANSLATIONS.subtitle}
                </div>
              </div>
              <div className="shrink-0">
                <UserMenu
                  user={user}
                  onLogout={onLogout}
                  translations={t.userMenu}
                  locale={locale}
                  languageOptions={languageOptions}
                  onChangeLocale={onChangeLocale}
                />
              </div>
            </div>
          </div>
          <div className="px-3 pb-5">
            <MainNav items={navItems} variant="sidebar" onNavigate={onNavigate} accent={accent} />
          </div>
          <div className="mt-auto px-5 pb-5">
            <div className="rounded-2xl border border-stone-200/70 dark:border-stone-800/70 bg-white/70 dark:bg-stone-950/60 p-4">
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200" style={{ fontFamily: fonts.heading }}>
                {t.offlineTitle ?? DEFAULT_SHELL_TRANSLATIONS.offlineTitle}
              </div>
              <div className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                {t.offlineDescription ?? DEFAULT_SHELL_TRANSLATIONS.offlineDescription}
              </div>
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="min-w-0 flex flex-col">
          {/* Mobile header */}
          <header className="md:hidden sticky top-0 z-40 border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-950/70 backdrop-blur">
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div
                  className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate"
                  style={{ fontFamily: fonts.heading }}
                >
                  {title}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                  {t.mobileSubtitle ?? DEFAULT_SHELL_TRANSLATIONS.mobileSubtitle}
                </div>
              </div>
              <UserMenu
                user={user}
                onLogout={onLogout}
                translations={t.userMenu}
                locale={locale}
                languageOptions={languageOptions}
                onChangeLocale={onChangeLocale}
              />
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
              {children}
            </div>
          </main>

          {/* Mobile bottom nav */}
          <div className="md:hidden sticky bottom-0 z-40">
            <MainNav items={navItems} variant="bottom" onNavigate={onNavigate} accent={accent} />
          </div>
        </div>
      </div>
    </div>
  )
}

