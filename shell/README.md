# Shell

## Overview

Senga App uses a calm, reverent shell that keeps users focused on scripture and teaching. Navigation is always available, optimized for mobile (bottom tabs) and scales to desktop (sidebar) without adding distractions.

## Navigation Items

- Home
- Library
- Plans
- Fellowship
- Giving

## Components

- `AppShell` — Responsive shell wrapper with desktop sidebar and mobile bottom navigation
- `MainNav` — Shared navigation renderer for sidebar and bottom variants
- `UserMenu` — User avatar menu with account actions and optional locale switcher

## Notes

- Components are self-contained and use local shell translation types.
- Wire callbacks (`onNavigate`, `onLogout`, `onChangeLocale`) into your app router and auth layer.
