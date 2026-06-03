# AGENTS_USAGE.md

## Agent Startup Checklist

1. Read `AGENTS.md` first.
2. Apply only relevant skills from `.agents/skills`.
3. Prefer existing patterns and components before creating new ones.
4. Keep changes interview-friendly and easy to justify.

## Working Rules

- Avoid duplicate UI implementations.
- Keep files small and focused.
- Keep strong typing and avoid `any`.
- Prefer readability over abstraction-heavy code.
- Avoid adding dependencies unless clearly justified.

## Technical Assessment Focus

Default priorities when implementing/reviewing:

1. Reusability of `ServiceCard` across contexts.
2. Correct UX states: loading, error with retry, empty.
3. Proper filter behavior with visible active state.
4. Form correctness with RHF + Zod and field-level validation.
5. Maintainability and naming clarity.

## Clarification Rules

When requirements are ambiguous:

- Ask focused clarification questions.
- Avoid inventing architecture constraints not requested.

## Conflict Resolution

If there is any conflict:

1. `AGENTS.md`
2. `.github/copilot-instructions.md`
3. `.github/instructions/*.md`
4. `.agents/skills/*`
