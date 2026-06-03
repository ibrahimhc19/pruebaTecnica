# Home Services Marketplace — Expo Technical Assessment

React Native + TypeScript technical assessment built with Expo.

## Goal

Demonstrate:

- clean architecture
- strong TypeScript usage
- reusable components
- complete UX states
- form validation
- maintainable engineering decisions

## Stack

- Expo (SDK 54)
- React Native
- TypeScript
- Expo Router

Recommended for forms:

- React Hook Form
- Zod

## Domain

Home services marketplace.

Examples:

- House Cleaning
- Plumbing
- Electrical Repairs
- Painting
- Appliance Repair

## Required Features

1. Services exploration with category filters.
2. Active filter visually distinct.
3. Loading, error (with retry), and empty states.
4. Featured services above main list.
5. Service detail with availability indicator.
6. CTA disabled when unavailable with explanation.
7. Request form with full name, phone, preferred date.
8. Field-level validation and disabled submit until valid.
9. Simulated 1.5 second submit with success/error handling.

## Expected Structure

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

## Scripts

```bash
npm install
npm run start
npm run lint
npm run typecheck
```

## Assumptions

- Service data is mocked locally for assessment purposes.
- Category filtering happens client-side because there is no real backend.
- Preferred Date is entered using `YYYY-MM-DD` format to keep dependencies minimal.
- Random failures are intentional to validate loading and submit error states.

## Architecture Decisions

- Kept route entrypoints in `app/` and screen orchestration in `src/screens`.
- Reused one `ServiceCard` component for featured and main list contexts using a variant prop.
- Isolated async behavior in hooks and data utilities rather than inside UI components.
- Used React Hook Form + Zod for predictable field validation and typed form values.

## Tradeoffs

- Date input uses text + schema validation instead of a date picker to keep the baseline simple.
- Fake API behavior is deterministic enough for testing states but not production-grade networking.
- Styling is intentionally straightforward to prioritize feature correctness over design polish.

## Future Improvements

- Introduce a dedicated API layer module with configurable failure rates for better testing.
- Add date picker UX and phone mask formatting for friendlier form input.
- Add component tests for loading/error/empty and form validation flows.
- Extract shared design tokens into a centralized theme file to reduce inline style repetition.

## Engineering Discussion Prompt

What would you change in your solution if this component were used by three different people on the team in different contexts?

Suggested talking points:

- component composition strategy
- variant patterns
- scaling without prop explosion
- design system evolution
- ownership boundaries between feature and shared UI
