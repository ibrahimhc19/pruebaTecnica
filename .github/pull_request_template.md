# Summary

Describe what this PR does.

---

## Assessment Scope Coverage (MANDATORY)

- [ ] Service exploration behavior is preserved or improved
- [ ] Category filtering keeps clear active state
- [ ] Loading state is handled
- [ ] Error state includes retry action
- [ ] Empty state is handled
- [ ] Featured services section remains above main list
- [ ] Service detail availability behavior is correct
- [ ] Unavailable CTA is disabled and explained
- [ ] Form validation behavior is correct
- [ ] Submit remains disabled until valid
- [ ] Simulated request delay and success/error handling are correct

---

## Architecture Checklist (MANDATORY)

- [ ] `ServiceCard` is reusable across multiple contexts
- [ ] No duplicated card implementations
- [ ] No `any`
- [ ] No dead code
- [ ] No massive components
- [ ] No unnecessary dependencies
- [ ] No unjustified abstractions
- [ ] Code follows target structure in `AGENTS.md`

---

## Testing Evidence (MANDATORY)

- [ ] Quality checks executed (`npm run lint && npm run typecheck`)
- [ ] Manual validation performed for affected UX states

Evidence:

- Lint:
- Typecheck:
- Manual UX verification:

---

## Skills Applied

Mention relevant skills:

- fixr-palette
- react-native-core
- react-native-forms-rhf-zod

---

## Notes for Review

- Follow AGENTS.md strictly
- Apply rules from `.agents/skills`
- Keep changes explainable in a technical interview

---

## README Discussion Prompt

Answer briefly:

What would you change in your solution if this component were used by three different people on the team in different contexts?

---

## Risk and Rollback

Risk level: Low / Medium / High

Rollback plan:
