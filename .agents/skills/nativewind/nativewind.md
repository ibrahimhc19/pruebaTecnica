---
name: nativewind
description: Using NativeWind (Tailwind CSS for React Native) with Expo. Covers installation, configuration, design token mapping, dark mode, platform caveats, and patterns for building styled components without StyleSheet.
---

# NativeWind

Stack: NativeWind v4 · Tailwind CSS v4 · Expo · TypeScript  
Scope: installation, configuration, token mapping, dark mode, caveats

---

## Core Principles

- NativeWind translates Tailwind utility classes to React Native `StyleSheet` at build time
- **Not all Tailwind utilities work in RN** — only layout, spacing, color, typography, and border utilities are supported. CSS features like `grid`, `::before`, `hover:` (without gesture) are not available
- Custom tokens can be mapped via `tailwind.config.js` for consistent design language
- NativeWind v4 requires Tailwind CSS v3 config format (not v4 `@theme inline`) — keep separate configs for web and mobile

---

## Installation

```bash
npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context

# Initialize Tailwind config
npx tailwindcss init
```

### `tailwind.config.js` — mirror Acuafit palette

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./features/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Mirror the Acuafit web palette (hex equivalents of HSL tokens)
        primary: {
          DEFAULT: "#2C3073",   // hsl(237 43% 30%) — indigo from logo
          foreground: "#E8EAFC",
          light: "#ECEEFF",
          hover: "#3A3F82",
        },
        accent: {
          DEFAULT: "#3FC5E6",   // hsl(193 75% 57%) — cyan from swimmer
          foreground: "#0A2830",
          light: "#E0F6FC",
        },
        background: "#FFFFFF",
        foreground: "#18191F",
        card:       "#FFFFFF",
        muted: {
          DEFAULT: "#F4F5FA",
          foreground: "#737588",
        },
        border:     "#D5D7E8",
        sidebar: {
          DEFAULT:    "#2C3073",
          foreground: "#C8CCEE",
          accent:     "#3A3F82",
          border:     "#222558",
        },
        success:     "#1A7A4A",
        warning:     "#D97706",
        destructive: "#DC2626",
        info:        "#0A8AA8",
      },
      fontFamily: {
        sans:  ["Inter_400Regular", "sans-serif"],
        medium: ["Inter_600SemiBold", "sans-serif"],
        bold:  ["Inter_700Bold", "sans-serif"],
        mono:  ["SpaceMono_400Regular", "monospace"],
      },
      borderRadius: {
        sm:  "6px",
        md:  "8px",
        lg:  "10px",
        xl:  "12px",
        "2xl": "16px",
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
```

### `babel.config.js`

```js
module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  }
}
```

### `metro.config.js`

```js
const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: "./global.css" })
```

### `global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Import in root layout

```tsx
// app/_layout.tsx
import "../global.css"
```

### TypeScript — add nativewind types

```ts
// nativewind-env.d.ts (root of project)
/// <reference types="nativewind/types" />
```

---

## Usage

```tsx
import { View, Text, Pressable } from "react-native"

export function StudentCard({ nombre, estado }: { nombre: string; estado: string }) {
  return (
    <View className="bg-card rounded-xl border border-border p-4 mb-3">
      <Text className="text-base font-medium text-foreground">{nombre}</Text>
      <Text className="text-sm text-muted-foreground mt-1">{estado}</Text>
    </View>
  )
}

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-primary rounded-lg py-3.5 items-center active:opacity-80"
    >
      <Text className="text-primary-foreground font-medium text-base">{label}</Text>
    </Pressable>
  )
}
```

---

## Dark Mode

NativeWind supports dark mode via the `dark:` prefix. Trigger it by adding `dark` class to a root view, or use `useColorScheme`.

```tsx
import { useColorScheme } from "nativewind"

export function RootLayout() {
  const { colorScheme } = useColorScheme()

  return (
    <View className={colorScheme === "dark" ? "dark flex-1" : "flex-1"}>
      {/* children inherit dark mode */}
    </View>
  )
}
```

```tsx
// Dark mode tokens in tailwind.config.js
colors: {
  background: {
    DEFAULT: "#FFFFFF",
    dark:    "#0D0F1F",   // hsl(237 30% 8%)
  },
  card: {
    DEFAULT: "#FFFFFF",
    dark:    "#13152A",   // hsl(237 30% 11%)
  },
}

// Usage
<View className="bg-background dark:bg-background-dark" />
```

---

## Supported vs Unsupported Utilities

### Supported

- Layout: `flex`, `flex-1`, `flex-row`, `items-center`, `justify-between`, `gap-*`
- Spacing: `p-*`, `m-*`, `px-*`, `py-*`, `mx-*`, `my-*`
- Sizing: `w-*`, `h-*`, `min-w-*`, `max-w-*`
- Colors: `bg-*`, `text-*`, `border-*`
- Typography: `text-*` (size), `font-*`, `leading-*`, `tracking-*`
- Borders: `border`, `border-*`, `rounded-*`
- Opacity: `opacity-*`
- Shadows (iOS): `shadow-*`
- Position: `absolute`, `relative`, `inset-*`, `top-*`, `left-*`

### Not supported

- `grid`, `grid-cols-*` — use `FlatList` with `numColumns` instead
- `hover:`, `focus:` pseudo-classes — use `Pressable` state callbacks
- `::before`, `::after` pseudo-elements — not applicable
- `transition-*`, `animate-*` — use `react-native-reanimated`
- `overflow-scroll` — use `ScrollView`
- `cursor-*` — not applicable on mobile

---

## Caveats

### `className` on custom components

For `className` to work on custom components, wrap with `cssInterop`:

```tsx
import { cssInterop } from "nativewind"
import { TextInput } from "react-native"

// Make TextInput accept className
cssInterop(TextInput, { className: "style" })

// Now this works
<TextInput className="border border-border rounded-lg px-3 py-2 text-foreground" />
```

### No `@apply` in React Native

`@apply` is web-only. Define reusable styles as component abstractions, not CSS utilities.

### Shadows differ by platform

```tsx
// NativeWind shadow utilities only work on iOS
// For Android, use elevation via StyleSheet
<View
  className="shadow-md"  // iOS
  style={{ elevation: 4 }}  // Android
/>
```

### Text style inheritance does NOT work

Unlike web, text styles don't cascade from parent `View` to child `Text` in React Native.

```tsx
// Wrong — color won't apply to Text
<View className="text-foreground">
  <Text>This won't be colored</Text>
</View>

// Correct
<View>
  <Text className="text-foreground">This will be colored</Text>
</View>
```

---

## Anti-patterns

| Anti-pattern | Why | Instead |
|---|---|---|
| `hover:` classes | Not supported in RN | Pressable `style={({ pressed }) => ...}` |
| `grid` layout | Not supported | `FlatList` with `numColumns` or flex row wrap |
| `@apply` in global CSS | Web only | Create component abstractions |
| `className` on custom components without `cssInterop` | Class won't apply | Use `cssInterop` or pass `style` prop |
| Expecting text style cascade | Doesn't work in RN | Apply text classes directly on `<Text>` |
| Using `transition-*` for animations | Not supported | `react-native-reanimated` |
