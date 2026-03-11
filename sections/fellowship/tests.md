# Test Specs: Fellowship

These test specs are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

Validate that Fellowship supports the intended user journeys, handles empty states correctly, and calls interaction callbacks with the right payloads.

---

## User Flow Tests

### Flow 1: Primary Journey

**Scenario:** User opens Fellowship and lands on a card-based hub with quick access to the three sub-features.

#### Success Path

**Setup:**
- Render section with representative populated data from `sample-data.json`
- Provide callback spies for all major actions

**Steps:**
1. User navigates to the Fellowship route
2. User confirms the primary heading and core CTA are visible
3. User triggers the main action for this flow
4. User completes required input (if any)
5. User confirms/continues

**Expected Results:**
- [ ] UI updates to reflect the completed action
- [ ] Relevant callback is invoked with expected arguments
- [ ] Any success feedback appears (message, state change, or route transition)

#### Failure Path: Submission/API Failure

**Steps:**
1. Repeat the same action while backend operation fails

**Expected Results:**
- [ ] Error feedback is visible and understandable
- [ ] User-entered input remains available when relevant

#### Failure Path: Validation Error

**Steps:**
1. Leave required fields empty (if the flow contains form input)
2. Confirm action

**Expected Results:**
- [ ] Validation UI appears next to the required field(s)
- [ ] Action is blocked until input is valid

---

### Flow 2: Secondary Journey

**Scenario:** User enters Testimony Wall, scrolls recent stories, and reacts with "Praise God" or shares a testimony.

#### Success Path

**Setup:**
- Use populated data with at least two records

**Steps:**
1. User opens the section
2. User chooses a non-primary interaction
3. User completes the interaction path

**Expected Results:**
- [ ] Correct destination/view opens
- [ ] State changes persist in UI

---

### Flow 3: Additional Journey

**Scenario:** User taps "Share a Testimony," writes a story, optionally posts as Anonymous, and can attach one image or a short audio clip.

**Expected Results:**
- [ ] User can finish the flow end-to-end
- [ ] Appropriate callback(s) are fired

---

## Empty State Tests

### Primary Empty State

**Scenario:** User has no primary records yet

**Setup:**
- Pass empty arrays for the main list/collection props

**Expected Results:**
- [ ] Empty-state heading and helper copy are visible
- [ ] Primary CTA is visible and interactive
- [ ] Triggering CTA routes user to creation/discovery action

### Related Records Empty State

**Scenario:** Parent record exists but related child records are empty

**Setup:**
- Render one parent item with empty children collection

**Expected Results:**
- [ ] Parent content still renders
- [ ] Child area shows specific empty-state copy
- [ ] CTA to add/continue children is available

---

## Component Interaction Tests

### Exported Components

**Renders correctly:**
- [ ] Components from `components/index.ts` mount without runtime errors
- [ ] Primary labels and key metadata are visible

**User interactions:**
- [ ] Clicking primary CTAs triggers correct callbacks
- [ ] Keyboard interaction works for actionable controls
- [ ] Any dismiss/close behavior works as expected

---

## Edge Cases

- [ ] Handles long text content without layout breakage
- [ ] Handles single-item and large-list states
- [ ] Transitions from empty to populated state smoothly
- [ ] Transitions from populated to empty state smoothly
- [ ] Preserves state correctly across route/view changes

---

## Accessibility Checks

- [ ] All interactive elements are keyboard accessible
- [ ] Form fields have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Focus is managed appropriately after actions

---

## Sample Test Data

Use the data from `sample-data.json` or create variations:

```typescript
const mockPopulated = {
  id: 'test-1',
  title: 'Sample Record',
}

const mockList = [mockPopulated]

const mockEmptyList: Array<unknown> = []
```
