import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Languages, LogOut, User as UserIcon } from 'lucide-react'
import { DEFAULT_SHELL_TRANSLATIONS } from './shell-types'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export interface UserMenuProps {
  user?: { name: string; avatarUrl?: string }
  onLogout?: () => void
  translations?: {
    signedInAs: string
    account: string
    logout: string
    ariaLabel: string
    languageLabel?: string
  }
  locale?: string
  languageOptions?: Array<{ code: string; label: string }>
  onChangeLocale?: (locale: string) => void
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const a = parts[0]?.[0] ?? 'U'
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
  return `${a}${b}`.toUpperCase()
}

const defaultUserMenu = DEFAULT_SHELL_TRANSLATIONS.userMenu!

export default function UserMenu({
  user,
  onLogout,
  translations = defaultUserMenu,
  locale,
  languageOptions,
  onChangeLocale,
}: UserMenuProps) {
  const label = user?.name?.trim() ? user.name : translations.account
  const fallback = initials(label)
  const showLanguageSwitcher = Boolean(languageOptions?.length && onChangeLocale)

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
          aria-label={translations.ariaLabel}
        >
          <AvatarPrimitive.Root className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-stone-200 dark:ring-stone-800">
            {user?.avatarUrl ? (
              <AvatarPrimitive.Image
                className="aspect-square h-full w-full"
                src={user.avatarUrl}
                alt={label}
              />
            ) : null}
            <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-xs font-semibold">
              {fallback}
            </AvatarPrimitive.Fallback>
          </AvatarPrimitive.Root>
          <span className="hidden sm:inline text-sm font-medium text-stone-800 dark:text-stone-100 max-w-40 truncate">
            {label}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className={cx(
            'z-50 min-w-56 overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-1 shadow-xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        >
          <div className="px-3 py-2">
            <div className="text-xs text-stone-500 dark:text-stone-400">{translations.signedInAs}</div>
            <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">{label}</div>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-stone-200 dark:bg-stone-800" />

          {showLanguageSwitcher && (
            <>
              <div className="px-3 py-1.5">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">{translations.languageLabel ?? 'Language'}</span>
              </div>
              {languageOptions!.map((opt) => (
                <DropdownMenu.Item
                  key={opt.code}
                  onSelect={() => onChangeLocale?.(opt.code)}
                  className={cx(
                    'flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none',
                    'text-stone-700 dark:text-stone-200',
                    'focus:bg-stone-100 dark:focus:bg-stone-900',
                    locale === opt.code && 'bg-stone-100 dark:bg-stone-900'
                  )}
                >
                  <Languages className="h-4 w-4 text-stone-500 dark:text-stone-400" strokeWidth={1.75} />
                  {opt.label}
                  {locale === opt.code && (
                    <span className="ml-auto text-xs font-semibold text-violet-600 dark:text-violet-400">✓</span>
                  )}
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator className="my-1 h-px bg-stone-200 dark:bg-stone-800" />
            </>
          )}

          <DropdownMenu.Item
            className={cx(
              'flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none',
              'text-stone-700 dark:text-stone-200',
              'focus:bg-stone-100 dark:focus:bg-stone-900'
            )}
          >
            <UserIcon className="h-4 w-4 text-stone-500 dark:text-stone-400" strokeWidth={1.75} />
            {translations.account}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => onLogout?.()}
            className={cx(
              'flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none',
              'text-stone-700 dark:text-stone-200',
              'focus:bg-stone-100 dark:focus:bg-stone-900'
            )}
          >
            <LogOut className="h-4 w-4 text-stone-500 dark:text-stone-400" strokeWidth={1.75} />
            {translations.logout}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

