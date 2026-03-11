# Milestone 8: Auth, Account & Sync

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 7 complete

---

## About This Handoff

**What you're receiving:**
- An account page with profile/preferences UI
- Placeholder Firebase client and service files
- Frontend contracts for user-aware experiences (saved items, progress, downloads, preferences)

**Your job:**
- Add real authentication and user-profile loading
- Persist user state across devices
- Connect account, preferences, and shell identity to Firebase
- Protect user-specific data and route behavior

This milestone makes the app personal, persistent, and multi-device aware.

---

## Goal

Implement real authentication and user account sync so progress, preferences, and private records are tied to a signed-in user instead of local-only placeholders.

## Overview

The app currently behaves like a signed-out prototype with a hardcoded guest identity. This milestone introduces Firebase Auth and Firestore-backed account state. It should support a low-friction MVP sign-in flow while persisting the user’s profile, language/theme preferences, saved items, plan progress, downloads metadata, prayer commitments, testimony drafts, and private counseling history.

**Key Functionality:**
- User can sign up, sign in, sign out, and restore session on app launch
- Shell and account page display the real user’s name, avatar, and email
- Theme and language preferences persist per account and across devices
- Saved sermons/series, plan progress, completed days, and reading state sync to Firestore
- Private user data is scoped correctly and not exposed publicly
- Guest mode remains safe for read-only browsing where appropriate

## Implementation Scope

### 1. Firebase Auth

- Install and configure Firebase SDK
- Replace `lib/firebase/client.ts` stub with real app initialization
- Implement one MVP auth flow:
  - Email link
  - Email/password
  - Google sign-in
- Add auth state restoration on app load

### 2. Account & Preferences

- Load and persist:
  - Display name
  - Avatar URL
  - Email
  - Preferred language
  - Preferred theme
- Connect account page profile section to real user data
- Replace hardcoded `Guest` shell identity

### 3. Synced User State

- Persist:
  - Saved sermons / series
  - Active plans
  - Completed content / days
  - Downloads metadata
  - Giving history ownership
  - Prayer commitments
  - Counseling request ownership

### 4. Security Rules

- Add Firestore security rules for user-owned documents
- Separate public community content from private user records
- Prevent anonymous access to protected write operations

## Expected User Flows

### Flow 1: Sign in and restore account

1. User signs in
2. App loads the user profile and account state
3. Shell and account page update immediately
4. **Outcome:** User identity is consistent across the app

### Flow 2: Resume on another device

1. User signs in on a second device
2. App restores saved preferences and synced progress
3. User resumes where they left off
4. **Outcome:** Account state follows the user, not the browser

### Flow 3: Access private features safely

1. User opens a private feature such as counseling history or giving history
2. App scopes data to the authenticated user
3. Unauthorized access is blocked
4. **Outcome:** Private records remain private

## Empty States

Make sure to handle:

- **Signed-out state:** Clear CTA to sign in for sync-required features
- **First sign-in:** New account with no progress or saved content
- **Partial profile:** User exists but has no avatar/display name yet

## Testing

Validate:

- Auth state restoration after refresh
- Protected data visibility by user
- Preference sync across devices/sessions
- Sign-out clears sensitive cached state from the UI

## Files to Reference

- `web/src/lib/firebase/client.ts`
- `web/src/lib/firebase/services.ts`
- `web/src/lib/firebase/collections.ts`
- `web/src/components/ShellLayout.tsx`
- `web/src/components/AccountPreferencesClient.tsx`
- `web/src/components/preferences-context.tsx`

## Done When

- [ ] Firebase auth is configured and working
- [ ] Real user identity appears in shell and account page
- [ ] Preferences persist across sessions and devices
- [ ] Saved items and plan progress sync to Firestore
- [ ] Private user records are secured by rules
- [ ] Signed-out users see safe fallback behavior
