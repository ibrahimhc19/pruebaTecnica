---
applyTo: "{app,src}/**/*.{ts,tsx}"
---

Frontend-specific instructions for this Expo + React Native assessment.

- Keep architecture interview-friendly and easy to explain.
- Favor reusable components over duplicated UI.
- `ServiceCard` must stay reusable across contexts.
- Keep state management simple.
- Prefer React Hook Form + Zod for forms.
- Keep field-level validation messages visible.
- Keep submit disabled until valid.
- Cover loading, error (with retry), empty, and unavailable CTA states.
- Use design tokens/palette guidance from `fixr-palette`.

Review focus for frontend changes:

1. Duplicated UI and missing reuse.
2. Type safety regressions (`any`, weak typing).
3. UX state regressions.
4. Overengineering and unjustified abstractions.
5. Missing validation behavior.
