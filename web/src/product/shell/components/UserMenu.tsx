'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOut, User as UserIcon } from 'lucide-react'
import { DEFAULT_SHELL_TRANSLATIONS } from './shell-types'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export interface UserMenuProps {
  user?: { name: string; avatarUrl?: string }
  onLogout?: () => void
  onOpenAccount?: () => void
  translations?: {
    signedInAs: string
    account: string
    logout: string
    ariaLabel: string
    languageLabel?: string
  }
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
  onOpenAccount,
  translations = defaultUserMenu,
}: UserMenuProps) {
  const label = user?.name?.trim() ? user.name : translations.account
  const fallback = initials(label)

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-hover-bg transition-colors"
          aria-label={translations.ariaLabel}
        >
          <AvatarPrimitive.Root className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border-default">
            {user?.avatarUrl ? (
              <AvatarPrimitive.Image
                className="aspect-square h-full w-full"
                src={user.avatarUrl}
                alt={label}
              />
            ) : null}
            <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-muted-bg-strong text-heading text-xs font-semibold">
              {fallback}
            </AvatarPrimitive.Fallback>
          </AvatarPrimitive.Root>
          <span className="hidden sm:inline text-sm font-medium text-heading max-w-40 truncate">
            {label}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className={cx(
            'z-50 min-w-56 overflow-hidden rounded-2xl border border-card-border bg-card-bg-solid p-1 shadow-xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        >
          <div className="px-3 py-2">
            <div className="text-xs text-muted">{translations.signedInAs}</div>
            <div className="text-sm font-semibold text-heading truncate">{label}</div>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-border-default" />



          <DropdownMenu.Item
            onSelect={() => onOpenAccount?.()}
            className={cx(
              'flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none',
              'text-body',
              'focus:bg-hover-bg'
            )}
          >
            <UserIcon className="h-4 w-4 text-muted" strokeWidth={1.75} />
            {translations.account}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={() => onLogout?.()}
            className={cx(
              'flex cursor-default select-none items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none',
              'text-body',
              'focus:bg-hover-bg'
            )}
          >
            <LogOut className="h-4 w-4 text-muted" strokeWidth={1.75} />
            {translations.logout}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

