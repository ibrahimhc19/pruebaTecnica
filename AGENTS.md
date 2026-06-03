# Expo HAS CHANGED

Read the exact versioned docs at <https://docs.expo.dev/versions/v54.0.0/> before writing any code.

## AGENTS.md — Frontend Technical Assessment (Expo + React Native)

## Project Scope

This repository is a frontend technical assessment for a home services marketplace.

Sample services:

- House Cleaning
- Plumbing
- Electrical Repairs
- Painting
- Appliance Repair

Target stack:

- Expo
- React Native
- TypeScript

The goal is to produce interview-friendly code that is maintainable, readable, and reusable.

## Required Product Capabilities

The implementation should support:

1. Services exploration screen.
2. Category filtering using chips/tabs with clear active state.
3. Loading, error (with retry), and empty states.
4. Featured services section above the main list.
5. Service detail screen with availability indicator.
6. Disabled CTA when unavailable plus explanation message.
7. Request form with full name, phone, preferred date.
8. Field-level validation messages.
9. Submit disabled until valid.
10. Simulated async request of 1.5 seconds.
11. Success and error handling for submit.

## Architecture Principles

- Favor small, focused modules over large files.
- Separate UI rendering from orchestration/business logic.
- Prefer composition over inheritance.
- Reuse one `ServiceCard` across multiple contexts (featured list, full list, etc).
- Avoid duplicate UI implementations for the same domain element.
- Prefer explicit code over clever abstractions.

## TypeScript Standards

- No `any`.
- Model domain with explicit types/interfaces.
- Type component props and hook returns.
- Keep shared data types in `src/types`.

## State Management

Keep state simple. Use the least complex option that works.

Priority:

1. local component state
2. context (if truly shared)
3. Zustand only when justified

Do not introduce complex global state patterns for this assessment.

## Validation Rules

- Prefer React Hook Form + Zod.
- Keep schema close to feature and export inferred types.
- Show field-level errors.
- Keep submit disabled while invalid.

## Folder Structure (Target)

```text
src/
  components/
    ServiceCard/
    CategoryChip/
    EmptyState/
    ErrorState/
    LoadingState/
  screens/
    ServicesScreen/
    ServiceDetailScreen/
  hooks/
  types/
  data/
  navigation/
  utils/
```

## Code Review Red Flags

Actively prevent:

- duplicated UI components for same concern
- `any`
- dead code
- massive components
- magic values
- premature optimization
- unnecessary dependencies

## Interview Readiness

Every abstraction should be defendable in a code review.

Assume reviewers will ask:

- Why this abstraction exists.
- Why this state location was chosen.
- How `ServiceCard` avoids duplication.
- How this scales to multiple team members and contexts.

## Design Tokens and Palette

- Use `fixr-palette` skill as color/design token source.
- Do not hardcode arbitrary colors throughout the UI.

## Instruction Precedence

1. This `AGENTS.md`
2. `.github/copilot-instructions.md`
3. `.github/instructions/*.md`
4. `.agents/skills/*`

If guidance conflicts, follow this order.
