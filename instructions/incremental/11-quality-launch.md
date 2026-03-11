# Milestone 11: Quality, Security & Launch Readiness

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 7–10 complete

---

## About This Handoff

**What you're receiving:**
- A near-complete product with real content, auth, writes, and offline capabilities
- Existing visual implementation across all major sections
- A codebase that now needs production hardening

**Your job:**
- Close the gap between “works locally” and “safe to launch”
- Add tests, observability, security guardrails, and operational readiness
- Improve accessibility, performance, and deployment confidence

This milestone is the final pass before MVP launch.

---

## Goal

Make the MVP production-ready by hardening reliability, security, accessibility, performance, observability, and deployment workflows.

## Overview

A product is not production-ready because routes exist; it is production-ready when failures are observable, user data is protected, core flows are tested, deploys are repeatable, and the app performs acceptably on real devices and networks. This milestone covers that final layer.

**Key Functionality:**
- Critical flows are covered by automated tests
- Errors are surfaced to users gracefully and captured for operators
- Security rules, environment handling, and secrets management are reviewed
- Performance is acceptable on low-end mobile devices and weak networks
- Accessibility issues are resolved for core flows
- Deployment, rollback, and monitoring paths are documented and repeatable

## Implementation Scope

### 1. Test Coverage

- Add automated coverage for:
  - Auth flows
  - Home daily content load
  - Library browse/search/detail
  - Plan progress and completion
  - Fellowship writes
  - Giving happy path and failure path
  - Theme/language persistence
- Include unit, integration, and at least one end-to-end pass for critical flows

### 2. Error Handling & Observability

- Add route-level and global error boundaries where needed
- Capture client and server errors to an observability tool
- Track important product events:
  - Sign in
  - Plan start / completion
  - Download started / completed
  - Donation initiated / succeeded / failed
- Add structured logs for provider and sync failures

### 3. Security & Privacy

- Review Firebase security rules
- Review any payment/webhook endpoints
- Verify no secrets leak to client bundles
- Ensure private counseling and giving data remain isolated per user
- Add abuse/rate-limit protections on public writes

### 4. Accessibility & Performance

- Audit keyboard navigation, focus states, labels, and contrast
- Validate dark/light themes and semantic tokens across all screens
- Optimize bundle/media loading and avoid unnecessary client-side work
- Test on low-end/mobile viewport scenarios

### 5. Deployment & Operations

- Finalize environment variable documentation
- Define deploy process for preview and production
- Add health checks / smoke checks
- Document rollback steps and incident-response basics for MVP

## Expected User Flows

### Flow 1: Critical flows are protected

1. User completes a primary task such as sign-in, plan progress, or giving
2. Automated tests cover the flow
3. Failures are caught before production or quickly after release
4. **Outcome:** The MVP is safer to operate

### Flow 2: Graceful failure

1. A dependency fails or returns invalid data
2. User sees a clear fallback state
3. Operators receive enough telemetry to diagnose the issue
4. **Outcome:** Production issues are survivable and traceable

### Flow 3: Repeatable launch

1. Team prepares a production deploy
2. Environment, build, smoke test, and rollback steps are documented
3. Release proceeds with confidence
4. **Outcome:** MVP launch is operationally manageable

## Empty States

Make sure to handle:

- **Service unavailable:** User-facing retry/fallback UX
- **Permission denied:** Auth-aware messaging instead of generic failure
- **No telemetry/config:** Safe defaults that still surface useful diagnostics

## Testing

Validate:

- Critical-path test suite passes in CI
- Error capture works in non-local environments
- Accessibility checks pass for main routes
- Performance is acceptable for the MVP target devices/network conditions

## Files to Reference

- `web/package.json`
- `web/src/app/`
- `web/src/lib/`
- `web/src/components/`
- `web/src/product/`

## Done When

- [ ] Critical user flows have automated test coverage
- [ ] Error handling and observability are in place
- [ ] Security rules and private-data boundaries are reviewed
- [ ] Accessibility issues on core flows are resolved
- [ ] Performance is acceptable for MVP target devices
- [ ] Deployment and rollback process is documented and repeatable
