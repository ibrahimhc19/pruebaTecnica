---
name: fixr-ui
description: UI engineering skill for Fixr, a home services marketplace React Native app. Covers screen architecture, reusable components, UX states, and the design system applied to the marketplace domain. Read fixr-palette first.
---

# Fixr — UI Skill

Stack: React Native · Expo · Expo Router · RHF + Zod  
Prerequisite: read `fixr-palette` before this skill  
Scope: screen architecture, components, UX states, booking flow, domain patterns

---

## Stack and Constraints

- **React Native + Expo**: functional components, hooks, explicit TypeScript throughout
- **Inline styles** via `style` prop with `uiTokens` — no `StyleSheet.create` unless reused in multiple places
- **Expo Router**: file-based navigation, stack screens in `app/_layout.tsx`
- **RHF + Zod**: all forms — see `react-native-forms-rhf-zod` skill
- **@expo/vector-icons** (Feather set): all iconography
- **Never hardcode colors** — always import from `@/theme/uiTokens`

---

## App Architecture (actual)

```text
app/
  _layout.tsx              # root layout with TopBar + Stack
  index.tsx                # → src/screens/ServicesScreen
  services/
    [id].tsx               # → src/screens/ServiceDetailScreen
    [id]/request.tsx       # → src/screens/RequestFormScreen

src/
  components/
    CategoryChip/
    EmptyState/
    ErrorState/
    LoadingState/
    RequestForm/
    ScreenLayout/
    ServiceCard/
    TopBar/
  screens/
    ServicesScreen/
    ServiceDetailScreen/
    RequestFormScreen/
  hooks/
    useServices.ts
    useServiceDetail.ts
    useRequestService.ts
  types/
    service.ts
    request.ts
    request.schema.ts
  data/
    services.ts
    categories.ts
  theme/
    uiTokens.ts
  utils/
    formatCurrency.ts
    formatDate.ts
    categoryColors.ts
```

---

## Domain Types

```ts
// src/types/service.ts

export type ServiceCategory =
  | "all"
  | "cleaning"
  | "plumbing"
  | "electrical"
  | "painting"
  | "appliance";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: Exclude<ServiceCategory, "all">;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  unavailableReason?: string;
  providerName: string;
  durationMinutes: number;
  tags: string[];
}
```

```ts
// src/types/request.ts
import type { ServiceRequestFormValues } from "@/types/request.schema";

export type { ServiceRequestFormValues };

export interface ServiceRequestPayload extends ServiceRequestFormValues {
  serviceId: string;
}

export interface ServiceRequestSuccess {
  requestId: string;
  message: string;
}
```

---

## Design Token Usage

All colors come from `src/theme/uiTokens.ts`:

```ts
import { uiColors } from "@/theme/uiTokens";

// Standard card pattern
<View style={{
  backgroundColor: uiColors.surface.base,
  borderColor: uiColors.border.default,
  borderWidth: 1,
  borderRadius: 12,
  padding: 16,
}}>
  <Text style={{ color: uiColors.text.primary, fontWeight: "600", fontSize: 15 }}>
    House Cleaning
  </Text>
  <Text style={{ color: uiColors.text.secondary, fontSize: 13 }}>
    From $35/hr
  </Text>
</View>

// Primary CTA button
<Pressable style={{
  backgroundColor: uiColors.brand.primary,
  borderRadius: 10,
  paddingVertical: 14,
  alignItems: "center",
}}>
  <Text style={{ color: uiColors.text.inverse, fontWeight: "700" }}>
    Book Now
  </Text>
</Pressable>

// Disabled button
<Pressable disabled style={{
  backgroundColor: uiColors.state.disabled,
  borderRadius: 10,
  paddingVertical: 14,
  alignItems: "center",
}}>
  <Text style={{ color: uiColors.text.inverse, fontWeight: "700" }}>
    Request Service
  </Text>
</Pressable>
```

---

## Reusable UI Components

### ServiceCard

Reused across featured list and full list via `variant` prop.

```tsx
// src/components/ServiceCard/ServiceCard.tsx
import { Pressable, Text, View } from "react-native";
import { uiColors } from "@/theme/uiTokens";
import { formatCurrency } from "@/utils/formatCurrency";
import { CATEGORY_COLORS } from "@/utils/categoryColors";
import { CATEGORY_LABELS } from "@/data/categories";
import { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
  onPress?: (service: Service) => void;
  variant?: "default" | "featured";
}

export function ServiceCard({ service, onPress, variant = "default" }: ServiceCardProps) {
  const isFeatured = variant === "featured";
  const badgeText = service.available ? "Available" : "Unavailable";
  // ...

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(service)}
      style={{
        borderWidth: 1,
        borderColor: uiColors.border.default,
        borderRadius: 12,
        padding: isFeatured ? 12 : 16,
        marginBottom: 12,
        backgroundColor: isFeatured ? uiColors.surface.featured : uiColors.surface.base,
      }}
    >
      {/* ... */}
    </Pressable>
  );
}
```

### CategoryChip

```tsx
// src/components/CategoryChip/CategoryChip.tsx
import { Pressable, Text, type LayoutChangeEvent } from "react-native";
import { uiColors } from "@/theme/uiTokens";
import { ServiceCategory } from "@/types/service";

interface CategoryChipProps {
  label: string;
  category: ServiceCategory;
  isActive: boolean;
  onPress: (category: ServiceCategory) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export function CategoryChip({ label, category, isActive, onPress, onLayout }: CategoryChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(category)}
      onLayout={onLayout}
      style={{
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginRight: 8,
        borderWidth: 1,
        borderColor: isActive ? uiColors.brand.primary : uiColors.border.default,
        backgroundColor: isActive ? uiColors.surface.chipActive : uiColors.surface.subtle,
      }}
    >
      <Text style={{
        color: isActive ? uiColors.brand.chipActiveText : uiColors.text.muted,
        fontWeight: "500",
      }}>
        {label}
      </Text>
    </Pressable>
  );
}
```

### EmptyState

```tsx
// src/components/EmptyState/EmptyState.tsx
import { Text, View } from "react-native";
import { uiColors } from "@/theme/uiTokens";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No services found",
  description = "Try changing your selected category filter.",
}: EmptyStateProps) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 40, gap: 6 }}>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>{title}</Text>
      <Text style={{ color: uiColors.text.secondary, textAlign: "center", paddingHorizontal: 24 }}>
        {description}
      </Text>
    </View>
  );
}
```

### LoadingState

```tsx
// src/components/LoadingState/LoadingState.tsx
import { ActivityIndicator, Text, View } from "react-native";
import { uiColors } from "@/theme/uiTokens";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading services..." }: LoadingStateProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <ActivityIndicator size="small" color={uiColors.brand.primary} />
      <Text>{label}</Text>
    </View>
  );
}
```

### ErrorState

```tsx
// src/components/ErrorState/ErrorState.tsx
import { Pressable, Text, View } from "react-native";
import { uiColors } from "@/theme/uiTokens";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 16 }}>
      <Text style={{ color: uiColors.text.danger, textAlign: "center" }}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={{
          backgroundColor: uiColors.brand.primary,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: uiColors.text.inverse, fontWeight: "600" }}>Retry</Text>
      </Pressable>
    </View>
  );
}
```

### TopBar

Global header rendered in `app/_layout.tsx`. Resolves the title from the current route pathname.

```tsx
// src/components/TopBar/TopBar.tsx
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { uiColors } from "@/theme/uiTokens";

function resolveTitle(pathname: string): string {
  if (pathname === "/") return "Services";
  if (/^\/services\/[^/]+\/request$/.test(pathname)) return "Request Service";
  return "Service Details";
}

export function TopBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isRoot = pathname === "/";

  return (
    <View style={{ backgroundColor: uiColors.surface.base, paddingTop: insets.top }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, minHeight: 52 }}>
        {!isRoot && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => ({
              marginLeft: -8,
              marginRight: 4,
              padding: 10,
              borderRadius: 10,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Feather name="chevron-left" size={24} color={uiColors.brand.primary} />
          </Pressable>
        )}
        <Text style={{ flex: 1, fontSize: 18, fontWeight: "700", color: uiColors.text.primary }} numberOfLines={1}>
          {resolveTitle(pathname)}
        </Text>
      </View>
      <View style={{
        height: Platform.OS === "ios" ? StyleSheet.hairlineWidth : 1,
        backgroundColor: uiColors.border.default,
      }} />
    </View>
  );
}
```

---

## UX States Pattern

Every data-driven screen must handle all four states: loading, error (with retry), empty, and data.

```tsx
if (isLoading) {
  return <LoadingState />;
}

if (error) {
  return <ErrorState message={error} onRetry={retry} />;
}

return (
  <FlatList
    data={filteredServices}
    renderItem={renderServiceItem}
    ListEmptyComponent={<EmptyState />}
  />
);
```

---

## Screen Patterns

### ServicesScreen

- Uses `useServices` hook for data, loading, error, category filtering
- `FlatList` for the service list (never `ScrollView` for data lists)
- `ListHeaderComponent` contains featured section + category chips
- Category chips in a horizontal `ScrollView` with auto-scroll to active

### ServiceDetailScreen

- Uses `useServiceDetail` hook for single service lookup
- Availability indicator with semantic colors
- CTA button disabled + grayed out when unavailable
- Navigates to request form only when available

### RequestFormScreen

- Uses `useServiceDetail` + `useRequestService` hooks
- `KeyboardAvoidingView` + `keyboardShouldPersistTaps="handled"`
- States: unavailable message, success feedback, error feedback, form
- Form is in its own component (`RequestForm`)

---

## Request Form Pattern

```tsx
// src/components/RequestForm/RequestForm.tsx
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestFormSchema, ServiceRequestFormValues } from "@/types/request.schema";
import { uiColors } from "@/theme/uiTokens";

interface RequestFormProps {
  isSubmitting: boolean;
  onSubmit: (values: ServiceRequestFormValues) => Promise<void>;
}

export function RequestForm({ isSubmitting, onSubmit }: RequestFormProps) {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<ServiceRequestFormValues>({
    defaultValues: { fullName: "", phoneNumber: "", preferredDate: "" },
    mode: "onChange",
    resolver: zodResolver(requestFormSchema),
  });

  return (
    <View style={{ gap: 12 }}>
      {/* Controlled TextInput fields for fullName, phoneNumber, preferredDate */}
      {/* Field-level error messages */}
      {/* Submit disabled={!isValid || isSubmitting} */}
    </View>
  );
}
```

Key rules:
- Always use `Controller` — no uncontrolled inputs
- `mode: "onChange"` for real-time validation
- Show field-level errors below each input
- Submit disabled while invalid or submitting
- `Keyboard.dismiss()` on submit

---

## Domain Vocabulary

| Concept | Term | Notes |
|---------|------|-------|
| Person providing service | **Provider** | Not "worker" or "vendor" |
| A service category | **Service** | Cleaning, Plumbing, etc. |
| A scheduled appointment | **Booking** | Not "appointment" or "reservation" |
| Booking cost | **Total** or **Price** | Not "amount" |
| Pro is free | **Available** | Not "online" or "active" |
| Pro is occupied | **Unavailable** | Not "offline" |

---

## Code Review Checklist

- [ ] All colors via `uiColors` from `@/theme/uiTokens` — no hardcoded hex
- [ ] All 4 UX states handled: loading, error (with retry), empty, data
- [ ] `FlatList` used for all lists — never `ScrollView` for data lists
- [ ] `KeyboardAvoidingView` + `keyboardShouldPersistTaps="handled"` on all forms
- [ ] All forms use RHF + Zod with `Controller` — no uncontrolled inputs
- [ ] `EmptyState` component used — no bare "No results" text
- [ ] `ServiceCard` reused via `variant` prop — no duplicate implementations
- [ ] No API calls inside components — data access via hooks
- [ ] Domain vocabulary consistent (Service, Provider, Available)
