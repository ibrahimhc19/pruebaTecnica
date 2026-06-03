---
name: frontend-code-organization
description: Enforce consistent code organization patterns including constants, types, utilities, and component structure.
---

# Frontend Code Organization Skill

## Goal

Ensure code is maintainable, predictable, and easy to scale by enforcing consistent organization patterns.

---

## Constants

- Do NOT hardcode:
  - magic numbers
  - strings (messages, labels)
  - configuration values

- Use:
  - global constants when shared
  - feature-level constants when scoped

Example:

- /constants/global.ts
- /features/users/constants.ts

---

## Types & Interfaces

- All types must be extracted into:
  - types.ts per feature
  - or global types if reused

- Avoid inline types in complex structures

---

## Utils

- Reusable logic must be extracted into utils

- Rules:
  - pure functions only
  - no side effects
  - no UI logic

---

## Component Structure (React Native)

Order inside components:

1. imports
2. types/interfaces
3. constants
4. hooks (useState, custom hooks)
5. derived values
6. effects (useEffect)
7. handlers
8. return (JSX)

Keep components focused. Split when a file starts mixing:

- list orchestration
- form logic
- reusable presentation

---

## Feature-Based Organization

- Prefer feature-level files over global when possible

Bad:

- everything in /utils

Good:

- /features/users/utils.ts

---

## Anti-patterns

- Hardcoded strings and numbers
- Inline complex types
- Utility functions inside components
- Duplicated logic across features
- Massive global utils/constants files
- `any`
- Massive component files that are hard to review

---

## Behavior

- Extract constants automatically
- Suggest moving types to types.ts
- Refactor reusable logic into utils
- Enforce component structure order
