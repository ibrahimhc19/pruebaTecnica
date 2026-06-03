---
name: react-native-auth
description: Authentication patterns for React Native with Expo. Covers token storage with expo-secure-store, auth context, protected routes with Expo Router, login/logout flow, token refresh, and biometric authentication.
---

# React Native Auth

Stack: Expo SecureStore · Expo Router · TanStack Query · React Native  
Scope: token storage, auth context, protected routes, login flow, token refresh, biometrics

---

## Core Principles

- **Never store tokens in AsyncStorage** — it is unencrypted. Always use `expo-secure-store`
- Auth state lives in a React context, initialized from SecureStore on app launch
- Protected routes use Expo Router's layout-based redirect pattern
- Token refresh is handled at the API client layer, not in components
- Biometrics are a convenience layer on top of token auth — not a replacement

---

## Setup

```bash
npx expo install expo-secure-store expo-local-authentication
```

---

## Token Storage

```ts
// lib/tokenStorage.ts
import * as SecureStore from "expo-secure-store"

const ACCESS_TOKEN_KEY  = "acuafit_access_token"
const REFRESH_TOKEN_KEY = "acuafit_refresh_token"

export const tokenStorage = {
  getAccessToken:  () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setAccessToken:  (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
  clearAll: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
  },
}
```

---

## Auth Context

```tsx
// lib/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react"
import { tokenStorage } from "@/lib/tokenStorage"
import { queryClient } from "@/lib/queryClient"

interface AuthState {
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  signIn:  (token: string, refreshToken: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token:           null,
    isLoading:       true,
    isAuthenticated: false,
  })

  // Restore token on app launch
  useEffect(() => {
    tokenStorage.getAccessToken().then((token) => {
      setState({ token, isLoading: false, isAuthenticated: !!token })
    })
  }, [])

  async function signIn(token: string, refreshToken: string) {
    await tokenStorage.setAccessToken(token)
    await tokenStorage.setRefreshToken(refreshToken)
    setState({ token, isLoading: false, isAuthenticated: true })
  }

  async function signOut() {
    await tokenStorage.clearAll()
    queryClient.clear()   // clear all cached data on logout
    setState({ token: null, isLoading: false, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
```

---

## Root Layout with Auth

```tsx
// app/_layout.tsx
import { AuthProvider } from "@/lib/auth/AuthContext"

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

---

## Protected Routes — Expo Router

Use layout files to guard route groups.

```tsx
// app/(app)/_layout.tsx — protected group
import { Redirect, Stack } from "expo-router"
import { useAuth } from "@/lib/auth/AuthContext"
import { ActivityIndicator, View } from "react-native"

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#2C3073" />
      </View>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />
  }

  return <Stack />
}
```

```tsx
// app/(auth)/_layout.tsx — public group (login, register)
import { Redirect, Stack } from "expo-router"
import { useAuth } from "@/lib/auth/AuthContext"

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  // Already authenticated — redirect to app
  if (isAuthenticated) return <Redirect href="/" />

  return <Stack screenOptions={{ headerShown: false }} />
}
```

---

## Login Screen

```tsx
// app/(auth)/login.tsx
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/lib/auth/AuthContext"
import { authService } from "@/features/auth/auth.service"

const loginSchema = z.object({
  email:    z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})
type LoginValues = z.infer<typeof loginSchema>

export default function LoginScreen() {
  const { signIn } = useAuth()
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginValues) {
    try {
      const { token, refreshToken } = await authService.login(values)
      await signIn(token, refreshToken)
    } catch {
      setError("root", { message: "Credenciales incorrectas" })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acuafit</Text>
      <Text style={styles.subtitle}>Academia de natación</Text>

      {errors.root && (
        <Text style={styles.rootError}>{errors.root.message}</Text>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="#737588"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Contraseña"
            placeholderTextColor="#737588"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={({ pressed }) => [styles.button, (pressed || isSubmitting) && styles.buttonPressed]}
      >
        <Text style={styles.buttonLabel}>
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container:     { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" },
  title:         { fontSize: 28, fontWeight: "700", color: "#2C3073", textAlign: "center" },
  subtitle:      { fontSize: 14, color: "#737588", textAlign: "center", marginBottom: 32 },
  input:         { borderWidth: 1, borderColor: "#D5D7E8", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: "#18191F", marginTop: 12 },
  inputError:    { borderColor: "#DC2626" },
  error:         { fontSize: 12, color: "#DC2626", marginTop: 4 },
  rootError:     { backgroundColor: "#FEE2E2", color: "#DC2626", padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 },
  button:        { backgroundColor: "#2C3073", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 24 },
  buttonPressed: { opacity: 0.8 },
  buttonLabel:   { color: "#E8EAFC", fontSize: 15, fontWeight: "600" },
})
```

---

## API Client — Token Injection + Refresh

```ts
// lib/apiClient.ts
import { tokenStorage } from "./tokenStorage"
import { queryClient } from "./queryClient"
import Constants from "expo-constants"

const BASE_URL = Constants.expoConfig?.extra?.apiUrl as string

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await tokenStorage.getAccessToken()

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    // Attempt token refresh
    const refreshed = await tryRefreshToken()
    if (!refreshed) {
      // Refresh failed — force logout
      await tokenStorage.clearAll()
      queryClient.clear()
      // AuthContext will redirect to login via Redirect in layout
      throw new Error("Session expired")
    }
    // Retry the original request with the new token
    return request<T>(path, options)
  }

  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  return response.json()
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const refreshToken = await tokenStorage.getRefreshToken()
    if (!refreshToken) return false

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!res.ok) return false

    const { token, refresh_token } = await res.json()
    await tokenStorage.setAccessToken(token)
    await tokenStorage.setRefreshToken(refresh_token)
    return true
  } catch {
    return false
  }
}

export const apiClient = {
  get:    <T>(path: string) => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
```

---

## Biometric Authentication

Use biometrics as a fast re-authentication mechanism, not as the primary auth.

```ts
// lib/auth/biometrics.ts
import * as LocalAuthentication from "expo-local-authentication"

export async function isBiometricsAvailable(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync()
  const enrolled   = await LocalAuthentication.isEnrolledAsync()
  return compatible && enrolled
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage:   "Confirma tu identidad",
    cancelLabel:     "Cancelar",
    fallbackLabel:   "Usar contraseña",
    disableDeviceFallback: false,
  })
  return result.success
}
```

```tsx
// Usage — unlock app after background without re-login
function AppLockScreen() {
  const { signOut } = useAuth()

  async function handleBiometricUnlock() {
    const success = await authenticateWithBiometrics()
    if (!success) signOut()
  }

  useEffect(() => { handleBiometricUnlock() }, [])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Verificando identidad...</Text>
    </View>
  )
}
```

---

## Anti-patterns

| Anti-pattern | Why | Instead |
|---|---|---|
| `AsyncStorage` for tokens | Unencrypted — readable on rooted devices | `expo-secure-store` always |
| Auth state in TanStack Query | Query is for server state — auth is client state | React context + SecureStore |
| Token refresh in components | Race conditions, multiple refreshes | Centralize in API client |
| Not clearing `queryClient` on logout | Stale data from previous user persists | `queryClient.clear()` in `signOut` |
| Biometrics as sole auth | No fallback on biometric failure | Always have password fallback |
| Checking auth state in every screen | Scattered, error-prone | Layout-level redirect in Expo Router |
