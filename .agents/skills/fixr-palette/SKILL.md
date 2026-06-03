---
name: fixr-palette
description: Design tokens and color palette for Fixr, a home services marketplace React Native app. Fresh green/teal palette.
---

# Fixr — Palette and Design Tokens

App: Home services marketplace (Fixr)  
Stack: React Native · Expo · TypeScript

---

## Brand Identity

Fixr connects homeowners with service professionals (plumbers, electricians, cleaners, painters, appliance repair). The palette conveys:

- **Trust and reliability** — deep forest green as the primary anchor
- **Fresh and modern** — teal accent for CTAs and interactive highlights

---

## Palette Values

### Primary — Forest Green

| Role | Hex | Usage |
|------|-----|-------|
| `brand.primary` | `#1B6B52` | CTA buttons, active tab indicator, header backgrounds |
| `surface.chipActive` | `#CCFBF1` | Active chip background |
| `text.inverse` | `#F0FDFA` | Text on primary backgrounds |

### Accent — Teal

| Role | Hex | Usage |
|------|-----|-------|
| Teal accent | `#0BBFCE` | Highlights, links, secondary CTAs |
| Teal light | `#E0F7FA` | Featured card background, tinted accent surfaces |
| Teal foreground | `#064B52` | Text on accent backgrounds |

### Surfaces

| Role | Hex | Usage |
|------|-----|-------|
| `surface.base` | `#FFFFFF` | Card backgrounds |
| `surface.subtle` | `#F9FAFB` | Inactive chip background |
| `surface.featured` | `#E0F7FA` | Featured card background |
| `surface.success` | `#F0FDF4` | Available/success indicator background |
| `surface.danger` | `#FEF2F2` | Unavailable/error indicator background |

### Text

| Role | Hex | Usage |
|------|-----|-------|
| `text.primary` | `#111827` | Primary body text, headings |
| `text.secondary` | `#4B5563` | Secondary text, descriptions |
| `text.muted` | `#374151` | Metadata, inactive labels |
| `text.success` | `#166534` | Success messages, available label |
| `text.danger` | `#991B1B` | Error messages, unavailable label |
| `text.inverse` | `#F0FDFA` | Text on primary/CTA backgrounds |

### Borders

| Role | Hex | Usage |
|------|-----|-------|
| `border.default` | `#D1D5DB` | Card borders, input borders |
| `border.success` | `#15803D` | Success indicator border |
| `border.danger` | `#B91C1C` | Error indicator border |

### State

| Role | Hex | Usage |
|------|-----|-------|
| `state.disabled` | `#9CA3AF` | Disabled button background |

### Service Category Colors

Each service category has a distinct color for badges and icons.

| Service | Hex | 
|---------|-----|
| House Cleaning | `#0BBFCE` |
| Plumbing | `#1B6B52` |
| Electrical Repairs | `#D97706` |
| Painting | `#7C3AED` |
| Appliance Repair | `#DC2626` |

### Rating

| Role | Hex |
|------|-----|
| Filled star | `#F59E0B` |

---

## Implementation

All color values are centralized in `src/theme/uiTokens.ts`. Components import from there — never hardcode hex values in JSX.

```ts
import { uiColors } from '@/theme/uiTokens';

// Card
<View style={{ backgroundColor: uiColors.surface.base, borderColor: uiColors.border.default, borderWidth: 1, borderRadius: 12, padding: 16 }}>
  <Text style={{ color: uiColors.text.primary, fontWeight: '600', fontSize: 15 }}>
    House Cleaning
  </Text>
  <Text style={{ color: uiColors.text.secondary, fontSize: 13 }}>
    From $35/hr
  </Text>
</View>

// Primary button
<Pressable style={{ backgroundColor: uiColors.brand.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' }}>
  <Text style={{ color: uiColors.text.inverse, fontWeight: '700' }}>Book Now</Text>
</Pressable>

// Success indicator
<View style={{ backgroundColor: uiColors.surface.success, borderColor: uiColors.border.success, borderWidth: 1 }}>
  <Text style={{ color: uiColors.text.success, fontWeight: '600' }}>Available now</Text>
</View>

// Error indicator
<View style={{ backgroundColor: uiColors.surface.danger, borderColor: uiColors.border.danger, borderWidth: 1 }}>
  <Text style={{ color: uiColors.text.danger, fontWeight: '600' }}>Currently unavailable</Text>
</View>
```

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Hardcoded hex in JSX | Import from `uiTokens` |
| Using `text.success` color on `border.danger` | Match semantic pairs: text.danger ↔ border.danger ↔ surface.danger |
| Repeating style objects | Extract shared styles to local constants if reused >2 times |
