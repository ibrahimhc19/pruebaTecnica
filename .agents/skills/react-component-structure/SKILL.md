---
name: react-component-structure
description: Enforce clean, scalable structure for React components using TypeScript. Use when creating or refactoring UI components.
---

# React Component Structure Skill

## Goal

Ensure components are maintainable, readable, and follow single responsibility principles.

## Rules

### Component Design

- Use functional components only
- Each component must have a single responsibility
- Keep components under ~150 lines
- Prefer explicit props and naming over abstraction-heavy component APIs

### File Naming

- File name must match component name (PascalCase)
- One component per file

### Props

- Always define props using TypeScript interfaces
- Destructure props in function signature
- Avoid passing unnecessary props

Example:

```ts
interface UserCardProps {
  name: string;
  email: string;
}

export const UserCard = ({ name, email }: UserCardProps) => {};
```

### Rendering

- Prefer early returns
- Avoid nested ternaries
- Move complex conditions to variables

### Separation of Concerns

- No API calls inside components
- No heavy business logic inside components
- Keep presentation components reusable and stateless when possible

### Composition

- Prefer composition over large components
- Split UI into smaller reusable pieces

## Anti-patterns

- Components handling UI + API + state logic
- Files larger than ~200 lines
- Inline anonymous functions everywhere

## Behavior

- Refactor oversized components into smaller ones
- Suggest extracting logic into hooks if needed
- Suggest Context or Zustand only when local state is clearly insufficient
