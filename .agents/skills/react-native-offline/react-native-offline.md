---
name: react-native-offline
description: Offline-first patterns for React Native with Expo. Covers network detection, offline UI feedback, TanStack Query persistence with MMKV, optimistic updates, mutation queuing, and sync-on-reconnect strategies.
---

# React Native Offline

Stack: NetInfo · MMKV · TanStack Query · Expo  
Scope: network detection, offline UI, query persistence, mutation queuing, sync on reconnect

---

## Core Principles

- Detect network state with `@react-native-community/netinfo` — never assume connectivity
- Show clear offline feedback — users must know when they're working offline
- Persist query cache to MMKV so data survives app restarts without network
- Queue mutations offline and sync when connectivity is restored
- Optimistic updates reduce perceived latency on slow connections

---

## Network Detection

```bash
npx expo install @react-native-community/netinfo
```

### `useNetworkStatus` hook

```ts
// lib/hooks/useNetworkStatus.ts
import { useEffect, useState } from "react"
import NetInfo, { NetInfoState } from "@react-native-community/netinfo"

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [connectionType, setConnectionType] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? false)
      setConnectionType(state.type)
    })

    // Fetch initial state
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false)
      setConnectionType(state.type)
    })

    return unsubscribe
  }, [])

  return { isConnected, connectionType, isOffline: isConnected === false }
}
```

---

## Offline Banner

Show a persistent banner when offline. Place it in the root layout.

```tsx
// components/OfflineBanner.tsx
import { View, Text, StyleSheet } from "react-native"
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus"

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus()

  if (!isOffline) return null

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Sin conexión — mostrando datos guardados</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#D97706",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  text: { color: "#fff", fontSize: 13, fontWeight: "500" },
})
```

```tsx
// app/_layout.tsx
<SafeAreaProvider>
  <OfflineBanner />
  <Stack screenOptions={{ headerShown: false }} />
</SafeAreaProvider>
```

---

## Query Persistence with MMKV

Persist the TanStack Query cache to disk so data is available on app restart even without network.

```bash
npx expo install react-native-mmkv @tanstack/query-sync-storage-persister @tanstack/react-query-persist-client
```

```ts
// lib/queryPersister.ts
import { MMKV } from "react-native-mmkv"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"

const storage = new MMKV({ id: "query-cache" })

export const queryPersister = createSyncStoragePersister({
  storage: {
    setItem:    (key, value) => storage.set(key, value),
    getItem:    (key) => storage.getString(key) ?? null,
    removeItem: (key) => storage.delete(key),
  },
  throttleTime: 1000,   // debounce writes to 1s to reduce I/O
})
```

```tsx
// app/_layout.tsx
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { queryPersister } from "@/lib/queryPersister"
import { queryClient } from "@/lib/queryClient"

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister:  queryPersister,
        maxAge:     1000 * 60 * 60 * 24,  // persist up to 24h
        buster:     "v1",                  // bump this string to invalidate old cache on app update
      }}
    >
      {/* rest of providers */}
    </PersistQueryClientProvider>
  )
}
```

### Mark queries as persistent

Not all queries should be persisted. Use `meta.persist` to opt in.

```ts
export function useStudents() {
  return useQuery({
    queryKey:  studentKeys.list(),
    queryFn:   getStudents,
    meta:      { persist: true },
    staleTime: 1000 * 60 * 5,
  })
}
```

---

## Optimistic Updates

Apply the expected result immediately to the UI, then reconcile with the server response.

```ts
export function useUpdateStudentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) =>
      updateStudentStatus(id, estado),

    onMutate: async ({ id, estado }) => {
      // Cancel in-flight refetches for this query
      await queryClient.cancelQueries({ queryKey: studentKeys.list() })

      // Snapshot current value for rollback
      const previous = queryClient.getQueryData(studentKeys.list())

      // Optimistically update the cache
      queryClient.setQueryData(studentKeys.list(), (old: Student[] | undefined) =>
        old?.map((s) => (s.id === id ? { ...s, estado } : s)) ?? []
      )

      return { previous }
    },

    onError: (_err, _variables, context) => {
      // Roll back to snapshot on error
      if (context?.previous) {
        queryClient.setQueryData(studentKeys.list(), context.previous)
      }
    },

    onSettled: () => {
      // Always refetch to reconcile with server
      queryClient.invalidateQueries({ queryKey: studentKeys.list() })
    },
  })
}
```

---

## Mutation Queuing — Offline Writes

Queue mutations when offline and flush them when connectivity is restored.

```ts
// lib/offlineQueue.ts
import { MMKV } from "react-native-mmkv"

const storage = new MMKV({ id: "offline-queue" })
const QUEUE_KEY = "pending_mutations"

interface QueuedMutation {
  id:        string
  type:      string
  payload:   unknown
  timestamp: number
}

export const offlineQueue = {
  getAll(): QueuedMutation[] {
    const raw = storage.getString(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  },

  add(mutation: Omit<QueuedMutation, "id" | "timestamp">) {
    const all = this.getAll()
    all.push({ ...mutation, id: Date.now().toString(), timestamp: Date.now() })
    storage.set(QUEUE_KEY, JSON.stringify(all))
  },

  remove(id: string) {
    const all = this.getAll().filter((m) => m.id !== id)
    storage.set(QUEUE_KEY, JSON.stringify(all))
  },

  clear() { storage.delete(QUEUE_KEY) },
}
```

### Flush queue on reconnect

```ts
// lib/hooks/useQueueFlush.ts
import { useEffect } from "react"
import NetInfo from "@react-native-community/netinfo"
import { offlineQueue } from "@/lib/offlineQueue"
import { apiClient } from "@/lib/apiClient"

export function useQueueFlush() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (!state.isConnected) return

      const pending = offlineQueue.getAll()
      if (pending.length === 0) return

      for (const mutation of pending) {
        try {
          // Dispatch based on type
          if (mutation.type === "CREATE_ENROLLMENT") {
            await apiClient.post("/enrollments", mutation.payload)
          }
          // add other mutation types here
          offlineQueue.remove(mutation.id)
        } catch {
          // Leave in queue to retry next time
        }
      }
    })

    return unsubscribe
  }, [])
}
```

```tsx
// app/_layout.tsx
import { useQueueFlush } from "@/lib/hooks/useQueueFlush"

function AppWithQueueFlush({ children }: { children: React.ReactNode }) {
  useQueueFlush()
  return <>{children}</>
}
```

---

## Conditional UI Based on Connectivity

```tsx
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus"

export function NewEnrollmentButton() {
  const { isOffline } = useNetworkStatus()

  return (
    <Pressable
      disabled={isOffline}
      style={[styles.button, isOffline && styles.disabled]}
      onPress={() => router.push("/students/new")}
    >
      <Text style={styles.label}>
        {isOffline ? "Sin conexión" : "Nueva matrícula"}
      </Text>
    </Pressable>
  )
}
```

---

## Anti-patterns

| Anti-pattern | Why | Instead |
|---|---|---|
| Assuming `isConnected: true` on startup | NetInfo is async — initial value is `null` | Handle `null` state as "unknown" |
| No offline feedback | Users don't know why actions fail | Always show offline banner |
| Persisting all queries | Stale sensitive data persists | Opt in with `meta.persist` |
| Mutations without optimistic updates on slow connections | UI feels unresponsive | Apply optimistic update, roll back on error |
| Not handling `cancelQueries` before optimistic update | Race condition with in-flight data | Always cancel before setting cache |
| Queue flush without per-item error handling | One failure stops the whole queue | Try/catch per item, leave failures in queue |
