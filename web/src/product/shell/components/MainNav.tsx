'use client'

import { BookMarked, BookOpen, Bell, HeartHandshake, Home } from 'lucide-react'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}


export type NavigationItem = { label: string; href: string; isActive?: boolean }

type NavVariant = 'sidebar' | 'bottom'

export interface MainNavProps {
  items: NavigationItem[]
  variant?: NavVariant
  onNavigate?: (href: string) => void
  accent?: {
    activeBg: string
    activeText: string
    activeIcon: string
    hoverBg: string
    idleText: string
    idleIcon: string
  }
}

function iconForLabel(label: string) {
  const key = label.toLowerCase()
  if (key.includes('altar') || key.includes('home') || key.includes('accueil') || key.includes('ahabanza')) return Home
  if (key.includes('library') || key.includes('inyigisho')) return BookOpen
  if (key.includes('plans') || key.includes('amagahunda') || key.includes('gahunda')) return BookMarked
  if (key.includes('update') || key.includes('announcement')) return Bell
  if (key.includes('giving') || key.includes('donation') || key.includes('support')) return HeartHandshake
  return Home
}

export default function MainNav({
  items,
  variant = 'sidebar',
  onNavigate,
  accent,
}: MainNavProps) {
  const a = accent ?? {
    activeBg: 'bg-primary-600/10 dark:bg-primary-400/10',
    activeText: 'text-primary-800 dark:text-primary-200',
    activeIcon: 'text-primary-700 dark:text-primary-200',
    hoverBg: 'hover:bg-neutral-100 dark:hover:bg-neutral-900',
    idleText: 'text-neutral-700 dark:text-neutral-200',
    idleIcon: 'text-neutral-500 dark:text-neutral-400',
  }

  if (variant === 'bottom') {
    return (
      <nav
        className="grid grid-cols-5 gap-1 border-t border-surface-border bg-surface-bg backdrop-blur supports-[backdrop-filter]:bg-surface-bg px-2 py-2"
        aria-label="Primary"
      >
        {items.slice(0, 5).map((item) => {
          const Icon = iconForLabel(item.label)
          const isActive = Boolean(item.isActive)
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (!onNavigate) return
                e.preventDefault()
                onNavigate(item.href)
              }}
              className={cx(
                'group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-colors select-none',
                a.hoverBg,
                isActive && a.activeBg
              )}
            >
              <Icon
                className={cx('h-4 w-4', isActive ? a.activeIcon : cx(a.idleIcon, 'group-hover:text-body'))}
                strokeWidth={1.75}
              />
              <span
                className={cx(
                  'text-[11px] leading-none font-medium truncate max-w-[5.5rem]',
                  isActive ? a.activeText : cx(a.idleText, 'group-hover:text-heading')
                )}
              >
                {item.label}
              </span>
            </a>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {items.map((item) => {
        const Icon = iconForLabel(item.label)
        const isActive = Boolean(item.isActive)
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => {
              if (!onNavigate) return
              e.preventDefault()
              onNavigate(item.href)
            }}
            className={cx(
              'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors select-none',
              a.hoverBg,
              isActive && a.activeBg
            )}
          >
            <Icon
              className={cx('h-4 w-4 shrink-0', isActive ? a.activeIcon : cx(a.idleIcon, 'group-hover:text-body'))}
              strokeWidth={1.75}
            />
            <span
              className={cx(
                'text-sm font-medium',
                isActive ? a.activeText : cx(a.idleText, 'group-hover:text-heading')
              )}
            >
              {item.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}

