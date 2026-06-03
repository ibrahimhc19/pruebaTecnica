---
name: expo-setup
description: Project setup, configuration, and build tooling for React Native apps using Expo. Covers project initialization, app.config.ts, EAS Build, environment variables, native plugins, and monorepo considerations. Read this skill first before any other React Native skill.
---

# Expo Setup

Stack: Expo SDK (latest) · Expo Router · EAS Build · TypeScript  
Scope: project creation, configuration, environment variables, native plugins, builds

Use this repository's context: frontend-only technical assessment for a home services marketplace.

---

## Core Principles

- Use **Expo managed workflow** unless a native module is unavailable — it covers 95% of use cases
- Use **Expo Router** for navigation (file-based, same mental model as Next.js)
- Use **EAS Build** for all production builds — never `expo build` (deprecated)
- Keep `app.config.ts` (dynamic) instead of `app.json` (static) — allows environment-aware config
- Never commit `.env` files — use EAS secrets for CI/CD

---

## Project Initialization

```bash
npx create-expo-app@latest AcuafitApp --template blank-typescript
cd AcuafitApp

# Install Expo Router
npx expo install expo-router react-native-safe-area-context react-native-screens \
  expo-linking expo-constants expo-status-bar

# Install NativeWind (see nativewind skill)
# Install other dependencies as needed
```

### `package.json` — required `main` field for Expo Router

```json
{
  "main": "expo-router/entry"
}
```

---

## `app.config.ts`

Use TypeScript config for environment-aware values. Access env vars via `process.env` (injected by EAS or `.env` locally).

```ts
import { ExpoConfig, ConfigContext } from "expo/config"

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Acuafit",
  slug: "acuafit",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic", // supports dark mode
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#2C3073", // primary indigo
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.acuafit.app",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#2C3073",
    },
    package: "com.acuafit.app",
  },
  plugins: [
    "expo-router",
    // add native plugins here, e.g. "expo-camera", "expo-notifications"
  ],
  extra: {
    apiUrl: process.env.API_URL ?? "http://localhost:8000/api",
    eas: { projectId: process.env.EAS_PROJECT_ID },
  },
  experiments: {
    typedRoutes: true, // enables TypeScript types for Expo Router routes
  },
})
```

### Accessing config values at runtime

```ts
import Constants from "expo-constants"

const apiUrl = Constants.expoConfig?.extra?.apiUrl as string
```

---

## Environment Variables

### Local development — `.env.local`

```env
API_URL=http://192.168.1.x:8000/api
EAS_PROJECT_ID=your-project-id
```

> Use your local network IP, not `localhost` — the device/emulator can't reach `localhost` on the host machine.

### `.env` files are NOT automatically loaded by Expo

Install `dotenv` support:

```bash
npx expo install expo-constants
```

And reference via `process.env` in `app.config.ts` only — not in app source code directly. For runtime env vars, use `Constants.expoConfig.extra`.

### EAS secrets (production)

```bash
eas secret:create --scope project --name API_URL --value https://api.acuafit.com/api
```

---

## File Structure

```
app/                        # Expo Router — all screens live here
  (auth)/
    login.tsx
    _layout.tsx
  (app)/
    _layout.tsx             # tab/drawer navigator
    students/
      index.tsx             # /students
      [id].tsx              # /students/:id
      new.tsx               # /students/new
    payments/
      index.tsx
    _layout.tsx
  index.tsx                 # root redirect
  _layout.tsx               # root layout (providers, fonts)

assets/
components/                 # shared components
  ui/                       # design system primitives
features/                   # domain features (same as web)
  students/
    components/
    hooks/
    services/
    schemas/
lib/                        # utilities, API client, constants
```

---

## Root Layout — Providers

`app/_layout.tsx` is the entry point for all providers.

```tsx
import { Stack } from "expo-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
```

---

## EAS Build

### `eas.json`

```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "APP_ENV": "development" }
    },
    "preview": {
      "distribution": "internal",
      "env": { "APP_ENV": "preview" }
    },
    "production": {
      "env": { "APP_ENV": "production" }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Build commands

```bash
# Development build (installs on device, supports hot reload)
eas build --profile development --platform android

# Preview build (internal testing)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## Native Plugins

Add plugins to `app.config.ts` `plugins` array. Never modify `android/` or `ios/` directories manually in managed workflow — use `expo prebuild` only when dropping to bare.

```ts
plugins: [
  "expo-router",
  "expo-font",
  ["expo-notifications", { /* config */ }],
  ["expo-camera", { cameraPermission: "Allow Acuafit to use your camera." }],
]
```

---

## TypeScript Path Aliases

Configure `tsconfig.json` to match the web project:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| `localhost` API calls fail on device | Use local network IP or tunnel (`npx expo start --tunnel`) |
| Fonts not loading on first render | Use `SplashScreen.preventAutoHideAsync()` + wait for fonts |
| App crashes after adding native plugin | Run `npx expo prebuild` or create a new dev build via EAS |
| Hot reload stops working | Clear cache: `npx expo start --clear` |
| `process.env` undefined at runtime | Use `Constants.expoConfig.extra` — env vars are only for `app.config.ts` |
| Android back button closes app unexpectedly | Handle with `useBackHandler` from `react-native-back-handler` |
