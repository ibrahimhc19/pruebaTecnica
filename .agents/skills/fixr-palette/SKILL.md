---
name: fixr-palette
description: Design tokens and color palette for Fixr, a home services marketplace React Native app. Fresh green/teal palette, GitHub-style dark mode. Read this before building any screen or component.
---

# Fixr — Palette and Design Tokens

App: Home services marketplace (Fixr)  
Stack: React Native · Expo · NativeWind v4 · TypeScript

---

## Brand Identity

Fixr connects homeowners with service professionals (plumbers, electricians, cleaners, painters, appliance repair). The palette conveys:

- **Trust and reliability** — deep forest green as the primary anchor
- **Fresh and modern** — teal accent for CTAs and interactive highlights
- **Accessibility** — high contrast ratios across both modes
- **Dark mode** — GitHub-inspired: dark gray surfaces, not pure black

---

## `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // --- Primary — Forest green ---
        primary: {
          DEFAULT:    "#1B6B52",  // main CTAs, active tab, header bg
          hover:      "#24855F",  // pressed states
          light:      "#E0F5EE",  // icon bg, badge bg, tinted surfaces
          foreground: "#E0F5EE",  // text on primary bg
          muted:      "#4B9E7A",  // secondary text on white bg
        },

        // --- Accent — Teal ---
        accent: {
          DEFAULT:    "#0BBFCE",  // highlights, links, secondary CTAs
          hover:      "#0AAAB8",
          light:      "#E0F7FA",  // tinted accent surfaces
          foreground: "#064B52",  // text on accent bg
        },

        // --- Surfaces (light mode) ---
        background: "#F8FAF9",   // page background — off-white with green tint
        card:       "#FFFFFF",   // card surfaces
        surface:    "#EEF5F1",   // inset surfaces, input bg

        // --- Surfaces (dark mode) — GitHub-inspired ---
        dark: {
          background: "#0D1117",  // page background
          card:       "#161B22",  // card surfaces
          surface:    "#0F2018",  // inset / tinted surfaces
          elevated:   "#1C2B22",  // modals, bottom sheets
        },

        // --- Text ---
        foreground:   "#111827",  // primary text
        secondary:    "#4B5563",  // secondary text, labels
        muted:        "#9CA3AF",  // placeholder, hints
        "on-primary": "#E0F5EE",  // text on primary bg

        // --- Text dark mode ---
        "dark-foreground": "#E6EBE8",
        "dark-secondary":  "#A8D8C0",
        "dark-muted":      "#4B6055",

        // --- Borders ---
        border:      "#D4E8E0",   // light mode borders
        "border-dark": "#2A3B30", // dark mode borders

        // --- Service category colors ---
        // Each service category has a distinct icon tint
        service: {
          cleaning:    "#0BBFCE",  // teal — House Cleaning
          plumbing:    "#1B6B52",  // green — Plumbing
          electrical:  "#D97706",  // amber — Electrical
          painting:    "#7C3AED",  // violet — Painting
          appliance:   "#DC2626",  // red — Appliance Repair
        },

        // --- Semantic ---
        success:     "#1B6B52",   // same as primary
        warning:     "#D97706",
        destructive: "#DC2626",
        info:        "#0BBFCE",   // same as accent

        // --- Rating ---
        rating:      "#F59E0B",   // star color
      },

      fontFamily: {
        sans:   ["Inter_400Regular",   "sans-serif"],
        medium: ["Inter_500Medium",    "sans-serif"],
        semi:   ["Inter_600SemiBold",  "sans-serif"],
        bold:   ["Inter_700Bold",      "sans-serif"],
        mono:   ["SpaceMono_400Regular", "monospace"],
      },

      fontSize: {
        xs:   ["11px", { lineHeight: "16px" }],
        sm:   ["13px", { lineHeight: "18px" }],
        base: ["15px", { lineHeight: "22px" }],
        lg:   ["17px", { lineHeight: "24px" }],
        xl:   ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["28px", { lineHeight: "36px" }],
      },

      borderRadius: {
        sm:    "6px",
        md:    "8px",
        lg:    "12px",
        xl:    "16px",
        "2xl": "20px",
        full:  "9999px",
      },

      spacing: {
        // Extend with mobile-friendly touch targets
        "touch": "44px",   // minimum touch target
        "safe-bottom": "34px",  // iPhone home indicator
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
```

---

## Token Reference

### Primary — Forest Green

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#1B6B52` | CTA buttons, active tab indicator, header backgrounds |
| `primary-hover` | `#24855F` | Pressed/active state |
| `primary-light` | `#E0F5EE` | Service icon backgrounds, badge backgrounds |
| `primary-foreground` | `#E0F5EE` | Text on primary backgrounds |
| `primary-muted` | `#4B9E7A` | Secondary text, price labels, captions |

### Accent — Teal

| Token | Value | Usage |
|-------|-------|-------|
| `accent` | `#0BBFCE` | Links, secondary CTAs, rating highlights |
| `accent-light` | `#E0F7FA` | Tinted accent surfaces |
| `accent-foreground` | `#064B52` | Text on accent backgrounds |

### Service Category Colors

| Service | Token | Color | Usage |
|---------|-------|-------|-------|
| House Cleaning | `service-cleaning` | `#0BBFCE` | Icon tint |
| Plumbing | `service-plumbing` | `#1B6B52` | Icon tint |
| Electrical Repairs | `service-electrical` | `#D97706` | Icon tint |
| Painting | `service-painting` | `#7C3AED` | Icon tint |
| Appliance Repair | `service-appliance` | `#DC2626` | Icon tint |

Each service also gets a light background from the same family. See `serviceStyles` utility in the UI skill.

### Dark Mode Values

| Light token | Dark value | Notes |
|-------------|------------|-------|
| `background` `#F8FAF9` | `dark-background` `#0D1117` | GitHub canvas |
| `card` `#FFFFFF` | `dark-card` `#161B22` | GitHub card |
| `surface` `#EEF5F1` | `dark-surface` `#0F2018` | Inset/tinted |
| `border` `#D4E8E0` | `border-dark` `#2A3B30` | Dividers |
| `primary` `#1B6B52` | `#4BB88A` | Lightened for readability |
| `accent` `#0BBFCE` | `#3DC9D6` | Lightened for readability |
| `foreground` `#111827` | `dark-foreground` `#E6EBE8` | |
| `secondary` `#4B5563` | `dark-secondary` `#A8D8C0` | |

---

## Typography Scale

| Usage | Class | Size | Weight |
|-------|-------|------|--------|
| Screen title | `text-2xl font-bold` | 24px | 700 |
| Section header | `text-xl font-semi` | 20px | 600 |
| Card title | `text-base font-semi` | 15px | 600 |
| Body text | `text-base font-sans` | 15px | 400 |
| Label / caption | `text-sm font-sans` | 13px | 400 |
| Price | `text-sm font-semi font-mono` | 13px | 600 mono |
| Badge / tag | `text-xs font-semi` | 11px | 600 |

---

## Spacing and Sizing

| Token | Value | Usage |
|-------|-------|-------|
| Screen horizontal padding | `px-4` (16px) | All screens |
| Section gap | `gap-3` (12px) | Between cards |
| Card padding | `p-4` (16px) | Card inner padding |
| Icon container | 40×40dp, `rounded-xl` | Service icons |
| Avatar small | 36×36dp, `rounded-full` | Provider avatar in list |
| Avatar large | 64×64dp, `rounded-full` | Provider detail screen |
| Touch target min | 44dp | All interactive elements |
| Tab bar height | 60dp + safe area | Bottom tab bar |
| Bottom sheet handle | 4×32dp, `rounded-full`, `bg-border` | |

---

## Component Tokens — Quick Reference

### Status badges

```
Available  → bg-primary-light  text-primary       border-primary/20
Busy       → bg-amber-50       text-warning        border-warning/20
Booked     → bg-blue-50        text-blue-700       border-blue-200
Completed  → bg-gray-100       text-secondary      border-border
Cancelled  → bg-red-50         text-destructive    border-red-200
```

### Rating stars

```
Filled star  → text-rating (#F59E0B)
Empty star   → text-border  (#D4E8E0)
```

### Booking states — progress indicator

```
Pending    → accent
Confirmed  → primary
In Progress → warning
Completed  → primary
Cancelled  → destructive
```

---

## Dark Mode Usage in Components

Apply dark mode variants directly with NativeWind's `dark:` prefix. Wrap the root view with `dark` class based on `useColorScheme`.

```tsx
// Standard card pattern
<View className="bg-card dark:bg-dark-card border border-border dark:border-border-dark rounded-xl p-4">
  <Text className="text-foreground dark:text-dark-foreground text-base font-semi">
    House Cleaning
  </Text>
  <Text className="text-secondary dark:text-dark-secondary text-sm mt-1">
    From $35/hr
  </Text>
</View>

// Primary button
<Pressable className="bg-primary dark:bg-[#4BB88A] rounded-xl py-3.5 items-center active:opacity-80">
  <Text className="text-primary-foreground font-semi text-base">
    Book Now
  </Text>
</Pressable>

// Service icon container
<View className="bg-primary-light dark:bg-[#1B2D24] rounded-xl w-10 h-10 items-center justify-center">
  <Icon size={20} color="#1B6B52" />
</View>
```

---

## Global CSS (`global.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## NativeWind type reference (`nativewind-env.d.ts`)

```ts
/// <reference types="nativewind/types" />
```

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Text color doesn't change in dark mode | Always pair `text-foreground dark:text-dark-foreground` |
| Green looks washed out on dark bg | Use `#4BB88A` (lightened primary) in dark mode, not `#1B6B52` |
| Service icon colors bleed into dark surfaces | Dark icon bg should be `#1B2D24`, not `primary-light` |
| Border invisible in dark mode | Pair `border-border dark:border-border-dark` always |
| Text inside badge unreadable | Use the 800-level token of the same hue, not generic black |
