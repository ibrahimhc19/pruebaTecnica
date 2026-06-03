---
name: react-native-core
description: Core patterns for building React Native screens and components with Expo. Covers RN primitives vs web, layout with Flexbox, safe areas, keyboard handling, ScrollView vs FlatList, platform differences, and navigation with Expo Router. Required reading before building any screen.
---

# React Native Core

Stack: React Native · Expo · Expo Router · TypeScript  
Scope: primitives, layout, navigation, safe areas, keyboard, lists, platform differences

---

## Core Principles

- React Native has **no DOM** — no `div`, `span`, `p`. Everything is a native primitive
- **Flexbox is the only layout system** — and it defaults to `flexDirection: "column"` (opposite of web)
- **All styles are inline or StyleSheet** — no CSS classes (unless using NativeWind, see that skill)
- Touches are handled with `Pressable` — not `onClick`
- Text must always be inside a `<Text>` component — never bare strings in JSX
- Dimensions are in **density-independent pixels (dp)** — not px, rem, or em

---

## Primitive Mapping — Web vs React Native

| Web | React Native | Notes |
|-----|-------------|-------|
| `<div>` | `<View>` | Layout container |
| `<span>`, `<p>`, `<h1>` | `<Text>` | All text, any size |
| `<img>` | `<Image>` | Requires explicit `width`/`height` |
| `<input>` | `<TextInput>` | See keyboard section |
| `<button>` | `<Pressable>` | `TouchableOpacity` is legacy |
| `<ul>/<li>` | `<FlatList>` | For lists of any length |
| `<a>` | `<Link>` from expo-router | Navigation |
| `onClick` | `onPress` | |
| CSS classes | `StyleSheet.create` or NativeWind | |
| `overflow: scroll` | `<ScrollView>` | Only for short content |

---

## Layout — Flexbox Defaults

RN flexbox defaults differ from web:

```ts
// React Native defaults (different from web)
flexDirection: "column"   // web default is "row"
alignContent: "flex-start"
flexShrink: 0             // web default is 1
```

### Full-screen layout pattern

```tsx
import { View, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* screen content */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content:   { flex: 1, paddingHorizontal: 16 },
})
```

### `flex: 1` is mandatory for full-height children

```tsx
// Wrong — child won't fill available space
<View>
  <View style={{ height: "100%" }} />
</View>

// Correct
<View style={{ flex: 1 }}>
  <View style={{ flex: 1 }} />
</View>
```

---

## Safe Areas

Always use `SafeAreaView` from `react-native-safe-area-context` — never from `react-native` (deprecated, iOS only).

```tsx
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

// Option 1 — wrap the screen
<SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
  {/* content */}
</SafeAreaView>

// Option 2 — manual insets (for custom headers)
function Header() {
  const insets = useSafeAreaInsets()
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: "#2C3073" }}>
      {/* header content */}
    </View>
  )
}
```

Use `edges` prop to control which sides apply safe area padding:
- `["top"]` — status bar area only
- `["bottom"]` — home indicator area only
- `["top", "bottom"]` — both (most common for full screens)

---

## Navigation — Expo Router

Expo Router uses file-based routing. Screens are files in `app/`. Navigation works like a web router.

### Link component

```tsx
import { Link } from "expo-router"

<Link href="/students/new">
  <Text>Nuevo estudiante</Text>
</Link>

// With params
<Link href={`/students/${student.id}`}>
  <Text>{student.nombre}</Text>
</Link>
```

### Programmatic navigation

```tsx
import { router } from "expo-router"

// Push new screen
router.push("/students/new")

// Replace current screen (no back)
router.replace("/login")

// Go back
router.back()

// Push with params
router.push({ pathname: "/students/[id]", params: { id: student.id } })
```

### Reading route params

```tsx
import { useLocalSearchParams } from "expo-router"

export default function StudentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  // use id to fetch student
}
```

### Stack navigator layout

```tsx
// app/(app)/_layout.tsx
import { Stack } from "expo-router"

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="students/index"
        options={{ title: "Estudiantes", headerShown: true }}
      />
      <Stack.Screen
        name="students/[id]"
        options={{ title: "Detalle", headerShown: true }}
      />
    </Stack>
  )
}
```

### Tab navigator layout

```tsx
// app/(app)/_layout.tsx
import { Tabs } from "expo-router"
import { Users, CreditCard, LayoutDashboard } from "lucide-react-native"

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#2C3073" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: "Estudiantes",
          tabBarIcon: ({ color }) => <Users color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: "Pagos",
          tabBarIcon: ({ color }) => <CreditCard color={color} size={22} />,
        }}
      />
    </Tabs>
  )
}
```

---

## Lists — FlatList vs ScrollView

| Use case | Component |
|----------|-----------|
| Short, static content (forms, details) | `ScrollView` |
| Long or dynamic lists (students, payments) | `FlatList` |
| Grid layout | `FlatList` with `numColumns` |
| Sections with headers | `SectionList` |

**Never use `ScrollView` for long lists** — it renders all items at once and will crash on large datasets.

### FlatList pattern

```tsx
import { FlatList, View, Text, StyleSheet } from "react-native"

type Student = { id: string; nombre: string; estado: string }

interface Props {
  students: Student[]
  onPress: (id: string) => void
}

export function StudentList({ students, onPress }: Props) {
  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <Text style={styles.empty}>Sin resultados</Text>
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => onPress(item.id)} style={styles.item}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.estado}>{item.estado}</Text>
        </Pressable>
      )}
    />
  )
}

const styles = StyleSheet.create({
  list:      { paddingHorizontal: 16, paddingBottom: 32 },
  item:      { paddingVertical: 12 },
  separator: { height: 1, backgroundColor: "#D5D7E8" },
  nombre:    { fontSize: 15, fontWeight: "600", color: "#18191F" },
  estado:    { fontSize: 13, color: "#737588", marginTop: 2 },
  empty:     { textAlign: "center", color: "#737588", paddingTop: 48 },
})
```

---

## Keyboard Handling

The keyboard covers input fields on mobile. Always handle it explicitly.

```tsx
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"

export function FormScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16 }}
      >
        {/* form fields */}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
```

### `keyboardShouldPersistTaps="handled"`

Always set this on `ScrollView` wrapping a form — otherwise tapping a button while the keyboard is open dismisses the keyboard instead of triggering the button.

### Dismiss keyboard on submit

```tsx
import { Keyboard } from "react-native"

function onSubmit(values: FormValues) {
  Keyboard.dismiss()
  // submit logic
}
```

---

## Pressable vs TouchableOpacity

Always use `Pressable` — `TouchableOpacity` and `TouchableHighlight` are legacy.

```tsx
import { Pressable, Text, StyleSheet } from "react-native"

interface Props {
  label: string
  onPress: () => void
  disabled?: boolean
}

export function Button({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button:   { backgroundColor: "#2C3073", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  pressed:  { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  label:    { color: "#ECEEFF", fontWeight: "600", fontSize: 15 },
})
```

---

## Platform Differences

```tsx
import { Platform, StyleSheet } from "react-native"

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: "#2C3073",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
})

// Platform-specific components
const Component = Platform.OS === "ios" ? IOSComponent : AndroidComponent

// Platform-specific files (auto-resolved by Metro)
// Button.ios.tsx  — used on iOS
// Button.android.tsx — used on Android
// Button.tsx — fallback
```

---

## Image

Always provide explicit dimensions. Use `resizeMode` to control scaling.

```tsx
import { Image, StyleSheet } from "react-native"

<Image
  source={require("@/assets/logo.png")}   // local
  // source={{ uri: "https://..." }}       // remote
  style={styles.logo}
  resizeMode="contain"
/>

const styles = StyleSheet.create({
  logo: { width: 120, height: 60 },
})
```

For remote images with unknown dimensions, use `expo-image` (better caching, blurhash placeholder):

```tsx
import { Image } from "expo-image"

<Image
  source={{ uri: student.avatarUrl }}
  style={{ width: 48, height: 48, borderRadius: 24 }}
  placeholder={blurhash}
  contentFit="cover"
/>
```

---

## StyleSheet Best Practices

```tsx
import { StyleSheet } from "react-native"

// Always define styles outside the component
// StyleSheet.create validates and optimizes styles in production
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title:     { fontSize: 24, fontWeight: "700", color: "#18191F" },
})

// Dynamic styles — compute inline, reference static styles with array
<View style={[styles.card, isActive && styles.cardActive]} />

// Avoid — object literals create new objects on every render
<View style={{ flex: 1, padding: 16 }} />  // ok for one-offs, bad in lists
```

---

## Anti-patterns

| Anti-pattern | Why | Instead |
|---|---|---|
| `ScrollView` for long lists | Renders all items — memory crash | `FlatList` |
| Missing `flex: 1` on containers | Content won't fill screen | Always set on root container |
| `SafeAreaView` from `react-native` | Deprecated, iOS only | From `react-native-safe-area-context` |
| `TouchableOpacity` | Legacy API | `Pressable` |
| Bare strings in JSX | Runtime error | Always wrap in `<Text>` |
| `width: "100%"` on children | Unreliable — use flex instead | `flex: 1` or `alignSelf: "stretch"` |
| Inline style objects in FlatList | New object every render, causes re-renders | `StyleSheet.create` |
| No `keyExtractor` on FlatList | Warning + poor diff performance | Always provide unique key |
