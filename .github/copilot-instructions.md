# Copilot Instructions — Expo Technical Assessment

These rules apply to code generation and pull request reviews in this repository.

## Source of truth

- `AGENTS.md` is the primary architecture and workflow guide.
- If any skill conflicts with `AGENTS.md`, `AGENTS.md` wins.

## Review priorities

When reviewing code, prioritize findings in this order:

1. Feature correctness for required assessment scope.
2. Reusable component design (`ServiceCard` especially).
3. UX state quality (loading, error with retry, empty, disabled states).
4. Type safety and maintainability.
5. Unnecessary complexity or dependency risk.

## Non-negotiable implementation rules

- Do not create duplicated card implementations for different contexts.
- Avoid `any`.
- Avoid massive components.
- Avoid dead code and unused abstractions.
- Avoid magic values when constants/types improve clarity.
- Avoid premature optimization.

## Architecture guardrails

- Prefer feature-oriented organization.
- Keep UI and behavior orchestration separated.
- Keep files small and focused.
- Keep state management simple unless complexity is justified.

## Validation guardrails

- Prefer React Hook Form + Zod.
- Include field-level validation feedback.
- Keep submit disabled until form is valid.

## Documentation expectation

Ensure the codebase supports the README discussion prompt:

"What would you change in your solution if this component were used by three different people on the team in different contexts?"

## Skills location

- Skills live under `.agents/skills`.
