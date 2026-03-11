# Milestone 1: Shell

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---


## Goal

Set up the design tokens and application shell — the persistent chrome that wraps all sections.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind guidance
- See `product-plan/design-system/fonts.md` for Google Fonts setup

### 2. Application Shell

Copy shell components from `product-plan/shell/components/`:

- `AppShell.tsx` — Main layout wrapper
- `MainNav.tsx` — Navigation component
- `UserMenu.tsx` — User menu with avatar and locale switcher

**Wire Up Navigation:**

- **Home** → Daily verse + Impuguro feed
- **Library** → Sermon series archive + search
- **Plans** → Dynamic daily plans (Bible, devotional, etc.) with video/audio, written content, passages; filter by My Plans, Find Plans, Saved, Completed
- **Fellowship** → Testimony Wall, private counseling requests, and interactive prayer commitments
- **Giving** → Support the ministry (MoMo + Stripe/PayPal)

**User Menu:**

The user menu expects:
- User name
- Avatar URL (optional)
- Logout callback
- Optional locale change callback

## Files to Reference

- `product-plan/design-system/`
- `product-plan/shell/README.md`
- `product-plan/shell/components/`
- `product-plan/shell/screenshot.png`

## Done When

- [ ] Design tokens are configured
- [ ] Shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] User menu shows user info
- [ ] Responsive on mobile
