---
name: react-native-testing
description: Unit and integration testing for React Native apps using Jest and React Native Testing Library. Covers setup, component tests, hook tests, navigation mocking, async patterns, and RN-specific gotchas. Follows the same principles as the frontend-testing-vitest-rtl skill adapted for the RN environment.
---

# React Native Testing — Jest + React Native Testing Library

Stack: Jest · React Native Testing Library · @testing-library/jest-native · TypeScript  
Scope: components, hooks, form flows, navigation, async behavior

---

## Stack and Setup

### Required packages

```bash
npx expo install jest-expo @testing-library/react-native @testing-library/jest-native
npx expo install --dev @types/jest
```

### `package.json`

```json
{
  "scripts": {
    "test":          "jest --watchAll=false",
    "test:watch":    "jest --watchAll",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "preset":       "jest-expo",
    "setupFilesAfterFramework": ["@testing-library/jest-native/extend-expect"],
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ],
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/$1"
    },
    "coverageThreshold": {
      "global": { "branches": 80, "functions": 80, "lines": 80 }
    }
  }
}
```

> The `transformIgnorePatterns` entry is critical — Expo and many RN libraries ship untransposed ES modules that Jest can't parse without it.

### `jest.setup.ts`

```ts
import "@testing-library/jest-native/extend-expect"

// Mock expo-router globally
jest.mock("expo-router", () => ({
  router:              { push: jest.fn(), back: jest.fn(), replace: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({})),
  Link:                ({ children }: { children: React.ReactNode }) => children,
  Redirect:            () => null,
}))

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  getItemAsync:    jest.fn(),
  setItemAsync:    jest.fn(),
  deleteItemAsync: jest.fn(),
}))

// Mock expo-constants
jest.mock("expo-constants", () => ({
  default: { expoConfig: { extra: { apiUrl: "http://localhost:8000/api" } } },
}))
```

### Test file location

```
features/
  students/
    components/
      StudentCard.tsx
      StudentCard.test.tsx
    hooks/
      useStudents.ts
      useStudents.test.ts
    schemas/
      enrollment.schema.test.ts   // same as web — pure TS, no RN needed
```

---

## Core Principles

- **Same principles as the web testing skill** — test behavior, not implementation
- Query by **accessibility roles and labels**, not by test IDs or class names
- RN RNTL uses the same `getByRole`, `getByText`, `getByLabelText` API as web RTL
- Wrap async tests in `waitFor` when testing data loading states
- Mock navigation (`expo-router`) at the module level — never test router internals

---

## Component Tests

```tsx
// StudentCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react-native"
import { StudentCard } from "./StudentCard"

const defaultProps = {
  nombre:  "María García",
  grupo:   "Lun/Mié 7:00 am",
  sede:    "Aranjuez",
  estado:  "al_dia" as const,
  onPress: jest.fn(),
}

describe("StudentCard", () => {
  it("renders student information", () => {
    render(<StudentCard {...defaultProps} />)

    expect(screen.getByText("María García")).toBeOnTheScreen()
    expect(screen.getByText("Lun/Mié 7:00 am")).toBeOnTheScreen()
    expect(screen.getByText("Aranjuez")).toBeOnTheScreen()
  })

  it("renders 'Al día' badge for al_dia estado", () => {
    render(<StudentCard {...defaultProps} estado="al_dia" />)
    expect(screen.getByText("Al día")).toBeOnTheScreen()
  })

  it("renders 'Vencido' badge for vencido estado", () => {
    render(<StudentCard {...defaultProps} estado="vencido" />)
    expect(screen.getByText("Vencido")).toBeOnTheScreen()
  })

  it("calls onPress when card is tapped", () => {
    render(<StudentCard {...defaultProps} />)
    fireEvent.press(screen.getByText("María García"))
    expect(defaultProps.onPress).toHaveBeenCalledOnce()
  })
})
```

> Use `toBeOnTheScreen()` from `@testing-library/jest-native` — the RN equivalent of `toBeInTheDocument()`.

---

## Loading / Error / Empty States

```tsx
import { render, screen } from "@testing-library/react-native"
import { StudentList } from "./StudentList"

describe("StudentList", () => {
  it("shows loading indicator when isLoading", () => {
    render(<StudentList isLoading students={[]} />)
    expect(screen.getByRole("progressbar")).toBeOnTheScreen()
    // or: expect(screen.getByTestId("loading-skeleton")).toBeOnTheScreen()
  })

  it("shows error message when error is provided", () => {
    render(<StudentList students={[]} error="No se pudo cargar" />)
    expect(screen.getByText(/no se pudo cargar/i)).toBeOnTheScreen()
  })

  it("shows empty state when students is empty", () => {
    render(<StudentList students={[]} />)
    expect(screen.getByText(/sin resultados/i)).toBeOnTheScreen()
  })

  it("renders a row for each student", () => {
    const students = [
      { id: "1", nombre: "María García",  estado: "al_dia" as const },
      { id: "2", nombre: "Carlos Pérez",  estado: "pendiente" as const },
    ]
    render(<StudentList students={students} />)
    expect(screen.getByText("María García")).toBeOnTheScreen()
    expect(screen.getByText("Carlos Pérez")).toBeOnTheScreen()
  })
})
```

---

## Form Tests

RHF + Zod works identically to web. Use `fireEvent.changeText` for `TextInput`.

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native"
import { EnrollmentForm } from "./EnrollmentForm"

describe("EnrollmentForm", () => {
  it("shows validation error when nombre is empty on submit", async () => {
    const onSubmit = jest.fn()
    render(<EnrollmentForm onSubmit={onSubmit} />)

    fireEvent.press(screen.getByText("Registrar matrícula"))

    await waitFor(() => {
      expect(screen.getByText("El nombre es requerido")).toBeOnTheScreen()
    })

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("calls onSubmit with correct values when form is valid", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    render(<EnrollmentForm onSubmit={onSubmit} />)

    fireEvent.changeText(
      screen.getByPlaceholderText("Nombre completo"),
      "María García"
    )
    fireEvent.changeText(
      screen.getByPlaceholderText("Número de documento"),
      "10203040"
    )
    fireEvent.changeText(
      screen.getByPlaceholderText("0"),
      "120000"
    )

    // For select fields, simulate the value change directly
    // (modal-based selects are hard to drive through press — test the select component separately)
    fireEvent(screen.getByTestId("sede-select"), "onChange", "aranjuez")
    fireEvent(screen.getByTestId("grupo-select"), "onChange", "lun-mie-7")

    fireEvent.press(screen.getByText("Registrar matrícula"))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ nombre: "María García", mensualidad: 120000 })
      )
    })
  })
})
```

---

## Hook Tests — TanStack Query

Same `renderHook` + `QueryClientProvider` wrapper pattern as web, adapted for RN.

```tsx
import { renderHook, waitFor } from "@testing-library/react-native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useStudents } from "./useStudents"

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("useStudents", () => {
  afterEach(() => jest.restoreAllMocks())

  it("returns students on successful fetch", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: "1", nombre: "María García" }]))
    )

    const { result } = renderHook(() => useStudents(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })

  it("sets isError on network failure", async () => {
    jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"))

    const { result } = renderHook(() => useStudents(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
```

---

## Navigation Tests

Test that navigation is triggered — not router internals.

```tsx
import { render, screen, fireEvent } from "@testing-library/react-native"
import { router } from "expo-router"
import { StudentCard } from "./StudentCard"

// expo-router is mocked in jest.setup.ts

describe("StudentCard navigation", () => {
  it("navigates to student detail on press", () => {
    render(
      <StudentCard
        id="abc123"
        nombre="María García"
        estado="al_dia"
        grupo="Lun/Mié 7:00 am"
        sede="Aranjuez"
      />
    )

    fireEvent.press(screen.getByText("María García"))

    expect(router.push).toHaveBeenCalledWith("/students/abc123")
  })
})
```

---

## Async Rules

- Use `waitFor` for assertions that depend on async state changes
- Use `fireEvent.changeText` for `TextInput` (not `fireEvent.change`)
- Use `fireEvent.press` for `Pressable` / `TouchableOpacity`
- Do NOT use `act()` manually — RNTL handles it
- Do NOT use `setTimeout` as a workaround — always use `waitFor`

```tsx
// Preferred
await waitFor(() => {
  expect(screen.getByText("Guardado")).toBeOnTheScreen()
})

// Avoid
await new Promise(r => setTimeout(r, 500))
expect(screen.getByText("Guardado")).toBeOnTheScreen()
```

---

## RN-specific Gotchas

| Issue | Cause | Fix |
|-------|-------|-----|
| `transformIgnorePatterns` error | Expo modules ship as ESM | Add the full transform ignore pattern to `jest` config |
| `Cannot find module 'expo-router'` | Not mocked | Add mock in `jest.setup.ts` |
| `TextInput` value not updating | Using `fireEvent.change` | Use `fireEvent.changeText` |
| `FlatList` items not rendered | Jest environment has no layout | Provide `getItemLayout` or use `scrollTo` utility |
| Animated components break tests | Animations run async | Mock `Animated` or use `jest.useFakeTimers()` |
| `SafeAreaProvider` not found | Missing provider | Wrap render with `SafeAreaProvider` |

### SafeAreaProvider wrapper

```tsx
import { SafeAreaProvider } from "react-native-safe-area-context"

function renderWithProviders(ui: React.ReactElement) {
  return render(<SafeAreaProvider>{ui}</SafeAreaProvider>)
}
```

---

## Anti-patterns

| Anti-pattern | Why | Instead |
|---|---|---|
| `getByTestId` for everything | Bypasses semantics | `getByText`, `getByRole`, `getByPlaceholderText` |
| Testing `StyleSheet` values | Implementation detail | Test visible content and behavior |
| Snapshot tests for screens | Brittle, hides intent | Assert specific elements and interactions |
| Not mocking `expo-router` globally | Tests fail with routing errors | Mock in `jest.setup.ts` |
| `fireEvent.change` on `TextInput` | Wrong event name in RN | `fireEvent.changeText` |
| No `waitFor` on async state | Flaky tests that pass/fail randomly | Always await async assertions |
| Testing navigation internals | Tests the router, not your code | Assert `router.push` was called with correct path |

---

# Shipping Checklist

- [ ] `transformIgnorePatterns` configured in `jest` — prevents ESM parse errors
- [ ] `expo-router` mocked globally in `jest.setup.ts`
- [ ] `expo-secure-store` and `expo-constants` mocked
- [ ] Queries use `getByText` / `getByRole` / `getByPlaceholderText` — no `getByTestId` without justification
- [ ] `TextInput` interactions use `fireEvent.changeText`
- [ ] Async assertions wrapped in `waitFor`
- [ ] TanStack Query hooks tested with fresh `QueryClient` per test
- [ ] Navigation tested by asserting `router.push` calls, not by testing routes
- [ ] `SafeAreaProvider` wrapper available for screens that need it
- [ ] No snapshot tests for data-driven screens
- [ ] Zod schemas tested as pure TypeScript — no RN environment needed
