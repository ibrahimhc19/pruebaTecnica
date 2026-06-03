---
name: tanstack-query-rn
description: TanStack Query patterns for React Native with Expo. Covers QueryClient setup, app state refetching, network reconnect refetching, background fetch on focus, offline persistence with MMKV, and patterns for list + detail screens. Core query/mutation patterns are identical to web — this skill covers only the RN-specific differences.
---

# TanStack Query — React Native

Stack: TanStack Query v5 · Expo · React Native · TypeScript  
Scope: RN-specific setup, app state handling, network awareness, offline persistence

---

## Core Principles

- TanStack Query works identically in RN — same `useQuery`, `useMutation`, `useInfiniteQuery`
- The key difference is **app state** — on mobile, apps go to background. Query must respond to this
- Use `focusManager` and `onlineManager` to wire RN app lifecycle into Query
- Use `MMKV` + `query-sync-storage-persister` for offline persistence when needed
- Keep `QueryClient` in the root layout, initialized once

---

## QueryClient Setup

```tsx
// lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,       // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes
      refetchOnWindowFocus: false,      // handled manually via AppState
      refetchOnReconnect: true,
    },
  },
})
```

---

## App State — Refetch on Foreground

By default, TanStack Query refetches on window focus (web). In RN, the equivalent is when the app comes back from background. Wire it manually via `AppState`.

```tsx
// app/_layout.tsx
import { useEffect } from "react"
import { AppState, AppStateStatus } from "react-native"
import { focusManager } from "@tanstack/react-query"

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active")
  }
}

export default function RootLayout() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange)
    return () => subscription.remove()
  }, [])

  // ... rest of layout
}
```

---

## Network State — Refetch on Reconnect

Wire React Native's network state into Query's `onlineManager` so queries retry when connectivity is restored.

```bash
npx expo install @react-native-community/netinfo
```

```tsx
// app/_layout.tsx
import NetInfo from "@react-native-community/netinfo"
import { onlineManager } from "@tanstack/react-query"

// Call once at app startup
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})
```

---

## Full Root Layout with Query Wiring

```tsx
// app/_layout.tsx
import { useEffect } from "react"
import { AppState, AppStateStatus, Platform } from "react-native"
import { Stack } from "expo-router"
import { QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query"
import { SafeAreaProvider } from "react-native-safe-area-context"
import NetInfo from "@react-native-community/netinfo"
import { queryClient } from "@/lib/queryClient"
import "../global.css"

// Wire network state
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

// Wire app foreground state
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active")
  }
}

export default function RootLayout() {
  useEffect(() => {
    const sub = AppState.addEventListener("change", onAppStateChange)
    return () => sub.remove()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}
```

---

## Query Patterns — identical to web

The hook patterns are the same as in the web project. No RN-specific changes needed.

```tsx
// features/students/hooks/useStudents.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getStudents, createEnrollment } from "../services/students.service"
import type { EnrollmentFormValues } from "../schemas/enrollment.schema"

export const studentKeys = {
  all:    () => ["students"] as const,
  list:   () => [...studentKeys.all(), "list"] as const,
  detail: (id: string) => [...studentKeys.all(), "detail", id] as const,
}

export function useStudents() {
  return useQuery({
    queryKey: studentKeys.list(),
    queryFn:  getStudents,
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn:  () => getStudent(id),
    enabled:  !!id,
  })
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.list() })
    },
  })
}
```

---

## List Screen Pattern

```tsx
// app/(app)/students/index.tsx
import { View, FlatList, Text, RefreshControl } from "react-native"
import { useStudents } from "@/features/students/hooks/useStudents"
import { StudentCard } from "@/features/students/components/StudentCard"
import { router } from "expo-router"

export default function StudentsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useStudents()

  if (isLoading) return <LoadingSkeleton />

  if (isError) return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-destructive">Error al cargar estudiantes</Text>
    </View>
  )

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor="#2C3073"         // iOS spinner color
          colors={["#2C3073"]}        // Android spinner color
        />
      }
      ListEmptyComponent={
        <Text className="text-center text-muted-foreground pt-12">
          Sin estudiantes registrados
        </Text>
      }
      renderItem={({ item }) => (
        <StudentCard
          student={item}
          onPress={() => router.push(`/students/${item.id}`)}
        />
      )}
    />
  )
}
```

---

## Detail Screen Pattern

```tsx
// app/(app)/students/[id].tsx
import { View, Text, ScrollView } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { useStudent } from "@/features/students/hooks/useStudents"

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: student, isLoading, isError } = useStudent(id)

  if (isLoading) return <LoadingSkeleton />

  if (isError || !student) return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-destructive">Estudiante no encontrado</Text>
    </View>
  )

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="text-2xl font-bold text-foreground">{student.nombre}</Text>
      <Text className="text-muted-foreground mt-1">{student.grupo} · {student.sede}</Text>
    </ScrollView>
  )
}
```

---

## Mutation with Form

```tsx
import { useCreateEnrollment } from "@/features/students/hooks/useStudents"
import { EnrollmentForm } from "@/features/students/components/EnrollmentForm"
import { router } from "expo-router"

export default function NewEnrollmentScreen() {
  const { mutateAsync, isPending } = useCreateEnrollment()

  async function handleSubmit(values: EnrollmentFormValues) {
    await mutateAsync(values)
    router.back()
  }

  return <EnrollmentForm onSubmit={handleSubmit} isLoading={isPending} />
}
```

---

## Infinite Scroll / Pagination

```tsx
import { FlatList } from "react-native"
import { useInfiniteQuery } from "@tanstack/react-query"

export function useStudentsPaginated() {
  return useInfiniteQuery({
    queryKey: ["students", "paginated"],
    queryFn:  ({ pageParam = 1 }) => getStudentsPaginated({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  })
}

export function StudentListPaginated() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useStudentsPaginated()

  const students = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id}
      onEndReached={() => { if (hasNextPage) fetchNextPage() }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
      renderItem={({ item }) => <StudentCard student={item} onPress={() => {}} />}
    />
  )
}
```

---

## Offline Persistence with MMKV

For apps that need data to survive app restarts without network.

```bash
npx expo install react-native-mmkv @tanstack/query-sync-storage-persister @tanstack/react-query-persist-client
```

```tsx
// lib/queryPersister.ts
import { MMKV } from "react-native-mmkv"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"

const storage = new MMKV()

export const persister = createSyncStoragePersister({
  storage: {
    setItem: (key, value) => storage.set(key, value),
    getItem: (key) => storage.getString(key) ?? null,
    removeItem: (key) => storage.delete(key),
  },
})
```

```tsx
// app/_layout.tsx
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { persister } from "@/lib/queryPersister"

<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }} // 24h
>
  {/* app */}
</PersistQueryClientProvider>
```

---

## Anti-patterns

| Anti-pattern | Why | Instead |
|---|---|---|
| Not wiring `AppState` to `focusManager` | Queries never refetch when app comes back from background | Wire in root layout |
| Not wiring `NetInfo` to `onlineManager` | Failed queries don't retry on reconnect | Wire at app startup |
| `refetchOnWindowFocus: true` without `AppState` wiring | Has no effect in RN | Set to `false`, handle via `AppState` |
| New `QueryClient` per component | Cache doesn't persist | One instance in root layout |
| No `RefreshControl` on lists | No pull-to-refresh — bad UX | Always add on `FlatList` |
| Flattening `useInfiniteQuery` pages in render | Expensive recalculation | Memoize with `useMemo` |
