# Senga App

Senga App is an offline-first PWA for Pastor Senga's teachings, designed for low-data listeners in Rwanda and the diaspora. It brings daily scripture, exhortations, sermon discovery, guided plans, fellowship features, and account preferences into one focused experience.

## Product Summary

The app includes these main sections:

- `Home` for daily verse, exhortation, and live/urgent highlights
- `Library` for sermons, series, search, and downloads
- `Plans` for structured devotional and reading journeys
- `Fellowship` for testimonies, prayer, and private counseling
- `Giving` for ministry support
- `Account` for profile, theme, and language preferences

Current language support targets:

- `rw`
- `en`
- `fr`

## Tech Stack

- `Next.js` app in `web/`
- `React`
- `TypeScript`
- `Tailwind CSS`
- Planned content backend: `Sanity`
- Planned user/data backend: `Firebase`

## Current Status

The repository already contains:

- the working web app scaffold in `web/`
- the implemented UI and route structure for the main app sections
- design tokens and reusable product components
- milestone docs and MVP planning docs for incremental implementation

Still in progress for MVP:

- replacing sample data with real backend content
- auth and account sync
- real fellowship writes
- offline/PWA hardening
- launch-quality testing and production readiness

Live payment integration is intentionally deferred to `v1.1`.

## Project Structure

- `web/` — the actual Next.js application
- `instructions/incremental/` — milestone-by-milestone build plan
- `instructions/mvp-launch-checklist.md` — MVP launch plan and weekly execution plan
- `product-overview.md` — product scope and entities
- `design-system/` — tokens, fonts, and color guidance
- `data-shapes/` — frontend data contracts
- `shell/` — shell design assets/components
- `sections/` — section-level source designs, types, tests, and sample data
- `prompts/section-prompt.md` — optional prompt template for incremental implementation

## Getting Started

Install dependencies and run the web app:

```bash
cd web
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To create a production build:

```bash
cd web
npm run build
```

## Environment

The app currently includes:

- `web/.env.local.example`

Do not commit real `.env` files. The repository is configured to ignore them.

## Implementation Plan

The app is being built incrementally.

Recommended docs:

- `instructions/incremental/01-shell.md`
- `instructions/incremental/07-content-data.md`
- `instructions/incremental/08-auth-account-sync.md`
- `instructions/incremental/09-transactions-community.md`
- `instructions/incremental/10-offline-pwa.md`
- `instructions/incremental/11-quality-launch.md`
- `instructions/mvp-launch-checklist.md`

## Notes

- `sections/`, `shell/`, `design-system/`, and `data-shapes/` are still useful reference assets for ongoing implementation
- the repo root is now initialized as git and connected to GitHub
- the current default branch is `main`
