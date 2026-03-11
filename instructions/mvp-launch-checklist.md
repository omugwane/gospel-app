# Senga App MVP Launch Checklist

Use this checklist after the UI milestones are complete. It separates what must ship for a production-ready MVP from what can wait until `v1.1`.

---

## Roadmap Split

## Current Status Snapshot

### MVP Milestones

1. `Shell` — `mostly done`
2. `Home` — `partially done`
3. `Library` — `partially done`
4. `Plans` — `partially done`
5. `Fellowship` — `partially done`
6. `Giving` — `partially done`
7. `Content & Data Integration` — `not started`
8. `Auth, Account & Sync` — `partially done`
9. `Community Writes & Safe Giving Deferral` — `not started`
10. `Offline, PWA & Device Experience` — `not started`
11. `Quality, Security & Launch Readiness` — `not started`

### Notes

- `mostly done` means the UI, route structure, and core behavior are in place, but the milestone still has non-trivial production gaps.
- `partially done` means a meaningful portion is implemented, but important milestone requirements are still missing.
- `not started` means the milestone may have placeholder files or related UI, but the actual milestone goal is not yet meaningfully implemented.

---

## Roadmap Split

### MVP Milestones

1. `Shell`
2. `Home`
3. `Library`
4. `Plans`
5. `Fellowship`
6. `Giving`
7. `Content & Data Integration`
8. `Auth, Account & Sync`
9. `Community Writes & Safe Giving Deferral`
10. `Offline, PWA & Device Experience`
11. `Quality, Security & Launch Readiness`

### Post-MVP Milestones

12. `Giving Payments & Receipts`

---

## Must Have Before Launch

### 1. Real Data Everywhere

- [ ] Replace all `sample-data.json` usage in production routes
- [ ] Configure real `Sanity` project settings and environment variables
- [ ] Implement production `GROQ` queries for Home, Library, Plans, and Giving content
- [ ] Add CMS schemas for verses, exhortations, sermons, series, plans, funds, and live items
- [ ] Ensure locale-aware content loading with fallback behavior

### 2. Auth And Real User Identity

- [ ] Configure `Firebase` app initialization
- [ ] Implement sign-in, sign-out, and session restoration
- [ ] Replace hardcoded `Guest` identity in shell/account flows
- [ ] Load real profile data into the Account page
- [ ] Persist account-scoped theme and language preferences

### 2A. Language And Internationalization

- [ ] Define the UI translation strategy for `rw`, `en`, and `fr`
- [ ] Move hardcoded UI copy into a translation source of truth
- [ ] Ensure loading, empty, error, and settings states are translated
- [ ] Define locale fallback behavior for missing content translations
- [ ] Implement locale-aware formatting for dates, numbers, and currency where relevant
- [ ] Verify language switching updates both UI labels and localized content correctly

### 3. Persistence And Sync

- [ ] Sync saved sermons/series to the authenticated user
- [ ] Sync plan progress, completed days, and active plans
- [ ] Persist giving history ownership by user
- [ ] Persist counseling request ownership by user
- [ ] Restore synced state after refresh and on another device

### 4. Real Writes

- [ ] Replace placeholder callbacks with real writes for Fellowship flows
- [ ] Implement testimony creation and reactions
- [ ] Implement prayer point submission and prayer commitments
- [ ] Implement private counseling request submission
- [ ] Validate write payloads and show success/failure/retry states

### 5. Giving Launch Posture

- [ ] Decide whether Giving is hidden, read-only, or marked `Coming Soon` for MVP
- [ ] Ensure no payment flow can be triggered accidentally in production before providers are live
- [ ] Replace any misleading success/history behavior with safe MVP messaging
- [ ] Add a clear fallback CTA such as ministry contact or support information if needed
- [ ] Remove launch dependency on live provider callbacks, receipts, and transaction persistence

### 6. Privacy And Security

- [ ] Add and test Firestore security rules
- [ ] Protect private giving and counseling records per user
- [ ] Add basic moderation/rate-limiting for public community writes
- [ ] Ensure secrets do not leak to the client
- [ ] Review any webhook/provider endpoints for verification and abuse protection

### 7. Loading, Error, And Empty States

- [ ] Add `loading.tsx` where critical routes fetch data
- [ ] Add `error.tsx` and graceful failure states for major routes
- [ ] Add route-safe handling for missing IDs/slugs
- [ ] Ensure empty states exist for first-time and no-data experiences
- [ ] Ensure provider/payment failure states are clear to the user

### 8. Offline-First MVP Baseline

- [ ] Add real `manifest.json`
- [ ] Add app icons and PWA metadata
- [ ] Enable service worker / PWA registration
- [ ] Configure safe cache strategy for shell and critical content
- [ ] Enable Firestore offline persistence where supported

### 9. Core Quality Gates

- [ ] Add automated tests for auth, plan progress, fellowship writes, and giving
- [ ] Add at least one end-to-end pass for critical user journeys
- [ ] Add error monitoring / observability
- [ ] Fix obvious accessibility issues in key flows
- [ ] Verify dark/light theme behavior and semantic token consistency
- [ ] Run multilingual QA across `rw`, `en`, and `fr`

### 10. Launch Operations

- [ ] Finalize production environment variables
- [ ] Document deploy and rollback steps
- [ ] Run smoke checks on preview and production
- [ ] Confirm analytics/logging for critical flows
- [ ] Confirm legal/business assets needed for launch are present

Examples:
- privacy policy
- support contact
- payment provider business configuration
- app icons/branding assets

---

## Can Wait Until v1.1

### Product Enhancements

- [ ] Full profile editing flow with avatar upload
- [ ] Richer social/community moderation tools
- [ ] Expanded notification strategy and reminder scheduling
- [ ] Better admin tooling for content and community operations
- [ ] Advanced giving analytics and donor segmentation
- [ ] Integrate Rwanda-first live payment provider path
- [ ] Integrate international live payment provider path
- [ ] Persist donation and payment status end-to-end
- [ ] Generate receipts and full giving history from live transactions

### Experience Improvements

- [ ] Full semantic-token migration across every remaining screen
- [ ] More polished skeleton states and micro-interactions
- [ ] Advanced search ranking/filtering improvements
- [ ] More download-management controls and storage insights
- [ ] Better cross-device resume UX for media playback
- [ ] More advanced locale-specific copy refinement and editorial QA

### Platform And Scale

- [ ] Broader automated test coverage across all routes
- [ ] Performance profiling and deeper low-end-device optimization
- [ ] More advanced caching strategies for media and content freshness
- [ ] Internal dashboards for operational metrics
- [ ] Admin review workflows for testimonies and prayer submissions

---

## Suggested Launch Order

1. Complete `Content & Data Integration`
2. Complete `Auth, Account & Sync`
3. Complete `Community Writes & Safe Giving Deferral`
4. Complete `Offline, PWA & Device Experience`
5. Complete `Quality, Security & Launch Readiness`
6. Only after that, move non-critical polish to `v1.1`

---

## Week-by-Week Execution Plan

This plan assumes the current state of the repo:

- Core UI and route structure already exist
- Feature sections are implemented visually but still use sample data and placeholder callbacks
- Live payments are deferred to `v1.1`

If needed, this can be compressed for a larger team or stretched for a solo/fractional schedule.

### Week 1: Content Foundation

**Primary goal:** Replace sample-content scaffolding with a real CMS-backed data layer.

- Configure `Sanity` project IDs, dataset, and environment variables
- Define content schemas for:
  - verse
  - exhortation
  - sermon
  - series
  - topic
  - plan
  - plan content
  - giving editorial content
  - live / urgent update content
- Replace sample-data usage in the Home, Library, Plans, and Giving mappers
- Finalize locale-aware content loading and fallback rules
- Decide how translated content is modeled in `Sanity` for `rw`, `en`, and `fr`
- Add route-safe null handling for missing CMS records

**End-of-week exit:**

- Home, Library, Plans, and Giving read real content from `Sanity`
- No critical user-facing route depends on `sample-data.json`
- Localized content fallback behavior is defined and implemented

### Week 2: Auth And Account

**Primary goal:** Introduce real identity and remove the app’s guest-only behavior.

- Configure `Firebase` initialization
- Implement MVP sign-in / sign-out flow
- Restore session on app launch
- Replace hardcoded `Guest` state in shell and account page
- Load real profile fields:
  - name
  - email
  - avatar URL if available
- Persist account-scoped theme and language preferences
- Introduce the UI translation system / message source for shared interface copy
- Ensure language switching updates shell, account, and other shared UI correctly

**End-of-week exit:**

- A real user can sign in, refresh, and still see their account and preferences
- UI language switching works consistently for shared app chrome and account flows

### Week 3: Sync And User State

**Primary goal:** Make user-specific state persistent across sessions/devices.

- Persist saved sermons and series
- Persist plan progress, completed content, and active plans
- Persist counseling request ownership
- Persist any user-specific fellowship state that should survive refresh
- Wire Firestore collections and security boundaries for user-owned records
- Verify account-scoped state restores correctly after login on another device/session

**End-of-week exit:**

- User progress and saved state are no longer local-only

### Week 4: Community Writes And Giving Deferral

**Primary goal:** Make Fellowship real and Giving safe for MVP launch.

- Replace placeholder callbacks for:
  - testimony creation
  - testimony reactions
  - prayer point submission
  - prayer commitments
  - counseling request submission
- Add validation, failure states, retry states, and duplicate-submit protection
- Add minimum moderation safeguards:
  - profanity/spam filtering
  - anonymous-post rules
  - rate limiting or throttling
- Decide Giving MVP posture:
  - hidden
  - read-only
  - `Coming Soon`
- Remove any fake receipt/history/payment success behavior from MVP

**End-of-week exit:**

- Fellowship is backed by real writes
- Giving cannot mislead users into thinking live payments already work

### Week 5: Offline, PWA, And Route Resilience

**Primary goal:** Deliver the offline-first MVP baseline and production-safe route behavior.

- Add `manifest.json` and production app icons
- Enable PWA/service worker registration
- Configure safe caching for app shell and critical content
- Enable Firestore offline persistence where supported
- Add `loading.tsx`, `error.tsx`, and missing-record handling for key routes
- Verify installability on mobile
- Verify degraded behavior under slow/offline network conditions
- Verify localized loading/error/empty states across supported languages

**End-of-week exit:**

- App is installable
- Critical routes fail gracefully
- Offline baseline works for the shell and persisted data
- Core failure states are understandable in all supported MVP languages

### Week 6: Quality, Security, And Launch Prep

**Primary goal:** Harden the app enough to ship confidently.

- Add automated coverage for critical MVP paths:
  - auth
  - content loading
  - plan progress
  - fellowship writes
  - theme/language persistence
  - giving deferred-state behavior
- Add error monitoring / observability
- Review Firebase security rules and private-data isolation
- Verify secrets are not exposed to the client
- Fix obvious accessibility issues in core flows
- Run final multilingual QA for `rw`, `en`, and `fr`
- Run smoke tests on preview and production builds
- Finalize deployment, rollback, and launch checklist items

**End-of-week exit:**

- MVP exit criteria are satisfied
- Release candidate is ready for launch decision

### Optional Week 7: Buffer And Soft Launch

Use this week only if needed.

- Fix bugs found during smoke testing or stakeholder review
- Polish the highest-visibility UX gaps
- Tighten moderation and analytics if they are still weak
- Run a soft launch / internal pilot before public release

**End-of-week exit:**

- Public launch or controlled rollout proceeds with confidence

---

## MVP Exit Criteria

You can call the app `production-ready MVP` when:

- A real user can sign in and see their real account data
- All main sections load real content instead of sample data
- Supported MVP languages render correctly for both UI and content fallback paths
- Saving progress and private records persist correctly
- Fellowship actions perform real writes safely
- Giving is either safely deferred or clearly presented as not yet live
- The app installs as a PWA and has a usable offline baseline
- Critical flows are tested, observable, and recover gracefully from failure
