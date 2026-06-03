---
name: project-structure-enforcement
description: Enforce folder structure and file placement rules for this Expo React Native technical assessment.
---

# Project Structure Skill (Expo Assessment)

## Goal

Ensure files stay in predictable locations for a small Expo + TypeScript codebase.

## Target structure

```text
app/
  _layout.tsx
  index.tsx
  services/
    [id].tsx

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

## Placement rules

- Route entries belong in `app/` and should re-export screen modules from `src/screens`.
- Shared UI primitives and reusable domain components belong in `src/components`.
- Screen-level orchestration belongs in `src/screens`.
- Reusable logic belongs in `src/hooks` and `src/utils`.
- Domain contracts belong in `src/types`.
- Mock/static datasets belong in `src/data`.
- Keep navigation helpers in `src/navigation` if needed.

---

## Behavior

- Suggest relocation when files are misplaced.
- Avoid creating new top-level architecture folders unless justified.
- Keep structure lightweight and interview-friendly.
