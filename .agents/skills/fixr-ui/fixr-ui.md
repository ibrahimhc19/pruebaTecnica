---
name: fixr-ui
description: UI engineering skill for Fixr, a home services marketplace React Native app. Covers screen architecture, reusable components, UX states, domain-specific patterns (service cards, provider profiles, booking flow, ratings), and the design system applied to the marketplace domain. Read fixr-palette first.
---

# Fixr — UI Skill

Stack: React Native · Expo · NativeWind · Expo Router · TanStack Query · RHF + Zod  
Prerequisite: read `fixr-palette` before this skill  
Scope: screen architecture, components, UX states, booking flow, domain patterns

---

## Stack and Constraints

- **React Native + Expo**: functional components, hooks, explicit TypeScript throughout
- **NativeWind v4**: all styling via className. No `StyleSheet.create` unless value is dynamic (e.g. animated progress width)
- **Expo Router**: file-based navigation, tab bar via `(tabs)/_layout.tsx`, stack screens via `(app)/`
- **TanStack Query**: all server state — see `tanstack-query-rn` skill
- **RHF + Zod**: all forms — see `react-native-forms-rhf-zod` skill
- **Never hardcode colors** — always use tokens from `fixr-palette`

---

## App Architecture

```
app/
  (auth)/
    _layout.tsx
    login.tsx
    register.tsx
  (tabs)/
    _layout.tsx             # bottom tab bar
    index.tsx               # Explore / Home
    bookings.tsx            # My Bookings
    messages.tsx            # Chat
    profile.tsx             # Profile
  services/
    [id].tsx                # Service detail
  providers/
    [id].tsx                # Provider profile
  booking/
    new.tsx                 # Booking form
    [id].tsx                # Booking detail
    [id]/review.tsx         # Leave a review
  _layout.tsx               # root — providers, fonts, theme

features/
  services/
    components/
      ServiceCard.tsx
      ServiceCategoryBadge.tsx
      ServiceGrid.tsx
    hooks/
      useServices.ts
    schemas/
      booking.schema.ts
    services/
      services.service.ts
    types/
      service.types.ts
  providers/
    components/
      ProviderCard.tsx
      ProviderAvatar.tsx
      RatingStars.tsx
      ReviewCard.tsx
    hooks/
      useProvider.ts
    types/
      provider.types.ts
  bookings/
    components/
      BookingCard.tsx
      BookingStatusBadge.tsx
      BookingTimeline.tsx
    hooks/
      useBookings.ts
    schemas/
      booking.schema.ts
  auth/
    ...

components/
  ui/
    Button.tsx
    Card.tsx
    Badge.tsx
    Avatar.tsx
    Input.tsx
    ScreenHeader.tsx
    EmptyState.tsx
    LoadingSkeleton.tsx
    ErrorState.tsx
    Divider.tsx
    PriceLabel.tsx
```

---

## Domain Types

```ts
// features/services/types/service.types.ts

export type ServiceCategory =
  | "cleaning"
  | "plumbing"
  | "electrical"
  | "painting"
  | "appliance"

export interface Service {
  id:          string
  category:    ServiceCategory
  name:        string
  description: string
  basePrice:   number
  priceUnit:   "hour" | "flat" | "quote"
  imageUrl:    string
}

export interface Provider {
  id:          string
  name:        string
  avatarUrl:   string
  category:    ServiceCategory
  rating:      number
  reviewCount: number
  hourlyRate:  number
  isAvailable: boolean
  bio:         string
  completedJobs: number
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"

export interface Booking {
  id:          string
  service:     Service
  provider:    Provider
  status:      BookingStatus
  scheduledAt: string   // ISO date
  address:     string
  notes:       string
  totalPrice:  number
}
```

---

## Service Category Utilities

```ts
// lib/serviceStyles.ts
import type { ServiceCategory } from "@/features/services/types/service.types"

interface CategoryStyle {
  label:      string
  iconName:   string   // lucide-react-native icon name
  color:      string   // icon and badge text color
  bgColor:    string   // icon container bg (light)
  bgColorDark: string  // icon container bg (dark)
}

export const categoryStyles: Record<ServiceCategory, CategoryStyle> = {
  cleaning: {
    label:       "House Cleaning",
    iconName:    "Sparkles",
    color:       "#0BBFCE",
    bgColor:     "#E0F7FA",
    bgColorDark: "#0A2830",
  },
  plumbing: {
    label:       "Plumbing",
    iconName:    "Droplets",
    color:       "#1B6B52",
    bgColor:     "#E0F5EE",
    bgColorDark: "#0F2018",
  },
  electrical: {
    label:       "Electrical Repairs",
    iconName:    "Zap",
    color:       "#D97706",
    bgColor:     "#FEF3C7",
    bgColorDark: "#2D1E00",
  },
  painting: {
    label:       "Painting",
    iconName:    "Paintbrush",
    color:       "#7C3AED",
    bgColor:     "#EDE9FE",
    bgColorDark: "#1E1040",
  },
  appliance: {
    label:       "Appliance Repair",
    iconName:    "Wrench",
    color:       "#DC2626",
    bgColor:     "#FEE2E2",
    bgColorDark: "#2D0A0A",
  },
}
```

---

## Reusable UI Components

### Button

```tsx
// components/ui/Button.tsx
import { Pressable, Text, ActivityIndicator } from "react-native"

interface ButtonProps {
  label:    string
  onPress:  () => void
  variant?: "primary" | "secondary" | "ghost" | "destructive"
  size?:    "sm" | "md" | "lg"
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

const variantClasses = {
  primary:     "bg-primary dark:bg-[#4BB88A]",
  secondary:   "bg-primary-light dark:bg-[#0F2018] border border-primary/30",
  ghost:       "bg-transparent",
  destructive: "bg-destructive",
}

const labelClasses = {
  primary:     "text-primary-foreground",
  secondary:   "text-primary dark:text-[#4BB88A]",
  ghost:       "text-primary dark:text-[#4BB88A]",
  destructive: "text-white",
}

const sizeClasses = {
  sm: "py-2 px-4 rounded-lg",
  md: "py-3.5 px-5 rounded-xl",
  lg: "py-4 px-6 rounded-xl",
}

export function Button({
  label, onPress, variant = "primary", size = "md",
  loading = false, disabled = false, fullWidth = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={[
        "items-center justify-center flex-row gap-2",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50",
      ].filter(Boolean).join(" ")}
      style={({ pressed }) => pressed && { opacity: 0.8 }}
    >
      {loading && <ActivityIndicator size="small" color={variant === "primary" ? "#E0F5EE" : "#1B6B52"} />}
      <Text className={`font-semi text-base ${labelClasses[variant]}`}>
        {label}
      </Text>
    </Pressable>
  )
}
```

### ServiceCard

```tsx
// features/services/components/ServiceCard.tsx
import { Pressable, View, Text } from "react-native"
import { useColorScheme } from "nativewind"
import * as Icons from "lucide-react-native"
import { categoryStyles } from "@/lib/serviceStyles"
import type { Service } from "../types/service.types"

interface Props {
  service: Service
  onPress: (service: Service) => void
}

export function ServiceCard({ service, onPress }: Props) {
  const { colorScheme } = useColorScheme()
  const style = categoryStyles[service.category]
  const Icon = Icons[style.iconName as keyof typeof Icons] as React.ComponentType<{ size: number; color: string }>
  const iconBg = colorScheme === "dark" ? style.bgColorDark : style.bgColor

  return (
    <Pressable
      onPress={() => onPress(service)}
      className="bg-card dark:bg-dark-card border border-border dark:border-border-dark rounded-xl p-4 flex-row items-center gap-3 active:opacity-80"
    >
      {/* Category icon */}
      <View
        className="w-10 h-10 rounded-xl items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={20} color={style.color} />
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-foreground dark:text-dark-foreground text-base font-semi">
          {service.name}
        </Text>
        <Text className="text-secondary dark:text-dark-secondary text-sm mt-0.5">
          {service.description}
        </Text>
      </View>

      {/* Price */}
      <View className="items-end">
        <Text className="text-primary dark:text-[#4BB88A] text-sm font-semi font-mono">
          ${service.basePrice}
        </Text>
        <Text className="text-muted dark:text-dark-muted text-xs">
          /{service.priceUnit}
        </Text>
      </View>
    </Pressable>
  )
}
```

### ProviderCard

```tsx
// features/providers/components/ProviderCard.tsx
import { Pressable, View, Text, Image } from "react-native"
import { Star } from "lucide-react-native"
import { BookingStatusBadge } from "@/features/bookings/components/BookingStatusBadge"
import type { Provider } from "../types/provider.types"

interface Props {
  provider: Provider
  onPress:  (provider: Provider) => void
}

export function ProviderCard({ provider, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(provider)}
      className="bg-card dark:bg-dark-card border border-border dark:border-border-dark rounded-xl p-4 active:opacity-80"
    >
      <View className="flex-row items-center gap-3">
        {/* Avatar */}
        <Image
          source={{ uri: provider.avatarUrl }}
          className="w-14 h-14 rounded-full bg-surface dark:bg-dark-surface"
        />

        {/* Info */}
        <View className="flex-1">
          <Text className="text-foreground dark:text-dark-foreground text-base font-semi">
            {provider.name}
          </Text>

          <View className="flex-row items-center gap-1 mt-0.5">
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text className="text-foreground dark:text-dark-foreground text-sm font-medium">
              {provider.rating.toFixed(1)}
            </Text>
            <Text className="text-muted dark:text-dark-muted text-sm">
              ({provider.reviewCount} reviews)
            </Text>
          </View>

          <Text className="text-primary-muted dark:text-[#4BB88A] text-sm font-mono mt-0.5">
            ${provider.hourlyRate}/hr
          </Text>
        </View>

        {/* Availability */}
        <View className={[
          "px-2.5 py-1 rounded-full",
          provider.isAvailable
            ? "bg-primary-light dark:bg-[#0F2018]"
            : "bg-gray-100 dark:bg-dark-surface",
        ].join(" ")}>
          <Text className={[
            "text-xs font-semi",
            provider.isAvailable
              ? "text-primary dark:text-[#4BB88A]"
              : "text-muted dark:text-dark-muted",
          ].join(" ")}>
            {provider.isAvailable ? "Available" : "Busy"}
          </Text>
        </View>
      </View>

      {/* Stats row */}
      <View className="flex-row gap-4 mt-3 pt-3 border-t border-border dark:border-border-dark">
        <View>
          <Text className="text-muted dark:text-dark-muted text-xs">Jobs done</Text>
          <Text className="text-foreground dark:text-dark-foreground text-sm font-semi">
            {provider.completedJobs}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}
```

### BookingStatusBadge

```tsx
// features/bookings/components/BookingStatusBadge.tsx
import { View, Text } from "react-native"
import type { BookingStatus } from "@/features/services/types/service.types"

const statusConfig: Record<BookingStatus, { label: string; className: string; textClass: string }> = {
  pending:     { label: "Pending",     className: "bg-accent-light dark:bg-[#0A2830]", textClass: "text-accent-foreground dark:text-[#3DC9D6]" },
  confirmed:   { label: "Confirmed",   className: "bg-primary-light dark:bg-[#0F2018]", textClass: "text-primary dark:text-[#4BB88A]" },
  in_progress: { label: "In Progress", className: "bg-amber-50 dark:bg-[#2D1E00]", textClass: "text-warning dark:text-[#FBB040]" },
  completed:   { label: "Completed",   className: "bg-primary-light dark:bg-[#0F2018]", textClass: "text-primary dark:text-[#4BB88A]" },
  cancelled:   { label: "Cancelled",   className: "bg-red-50 dark:bg-[#2D0A0A]", textClass: "text-destructive dark:text-[#F87171]" },
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { label, className, textClass } = statusConfig[status]
  return (
    <View className={`px-2.5 py-1 rounded-full ${className}`}>
      <Text className={`text-xs font-semi ${textClass}`}>{label}</Text>
    </View>
  )
}
```

### RatingStars

```tsx
// features/providers/components/RatingStars.tsx
import { View } from "react-native"
import { Star } from "lucide-react-native"

interface Props {
  rating: number    // 0–5
  size?:  number
}

export function RatingStars({ rating, size = 14 }: Props) {
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          color="#F59E0B"
          fill={star <= Math.round(rating) ? "#F59E0B" : "transparent"}
        />
      ))}
    </View>
  )
}
```

### EmptyState

```tsx
// components/ui/EmptyState.tsx
import { View, Text } from "react-native"
import type { LucideIcon } from "lucide-react-native"

interface Props {
  icon:        LucideIcon
  title:       string
  description: string
  action?:     React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="bg-primary-light dark:bg-[#0F2018] w-16 h-16 rounded-2xl items-center justify-center mb-4">
        <Icon size={28} color="#1B6B52" />
      </View>
      <Text className="text-foreground dark:text-dark-foreground text-lg font-semi text-center">
        {title}
      </Text>
      <Text className="text-secondary dark:text-dark-secondary text-sm text-center mt-2 leading-5">
        {description}
      </Text>
      {action && <View className="mt-6">{action}</View>}
    </View>
  )
}
```

### LoadingSkeleton

```tsx
// components/ui/LoadingSkeleton.tsx
import { View } from "react-native"

interface SkeletonProps { className?: string }

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <View className={`bg-surface dark:bg-dark-surface rounded-md animate-pulse ${className}`} />
  )
}

export function ServiceCardSkeleton() {
  return (
    <View className="bg-card dark:bg-dark-card border border-border dark:border-border-dark rounded-xl p-4 flex-row items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <View className="flex-1 gap-2">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-3 w-48 rounded" />
      </View>
      <Skeleton className="h-4 w-12 rounded" />
    </View>
  )
}

export function ProviderCardSkeleton() {
  return (
    <View className="bg-card dark:bg-dark-card border border-border dark:border-border-dark rounded-xl p-4 flex-row items-center gap-3">
      <Skeleton className="w-14 h-14 rounded-full" />
      <View className="flex-1 gap-2">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </View>
    </View>
  )
}
```

### ScreenHeader

```tsx
// components/ui/ScreenHeader.tsx
import { View, Text, Pressable } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ArrowLeft } from "lucide-react-native"
import { router } from "expo-router"

interface Props {
  title:        string
  subtitle?:    string
  showBack?:    boolean
  right?:       React.ReactNode
  transparent?: boolean
}

export function ScreenHeader({ title, subtitle, showBack = false, right, transparent = false }: Props) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className={[
        "flex-row items-center px-4 pb-3",
        transparent ? "" : "bg-background dark:bg-dark-background border-b border-border dark:border-border-dark",
      ].join(" ")}
      style={{ paddingTop: insets.top + 8 }}
    >
      {showBack && (
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-lg -ml-2 mr-2 active:bg-surface dark:active:bg-dark-surface"
        >
          <ArrowLeft size={22} color="#111827" />
        </Pressable>
      )}

      <View className="flex-1">
        <Text className="text-foreground dark:text-dark-foreground text-xl font-bold">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-secondary dark:text-dark-secondary text-sm mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>

      {right && <View>{right}</View>}
    </View>
  )
}
```

---

## UX States Pattern

Every data-driven screen must handle all four states. Never render just the happy path.

```tsx
// Standard screen state handler
interface ScreenStateProps<T> {
  isLoading:  boolean
  isError:    boolean
  data:       T | undefined
  onRetry:    () => void
  children:   (data: T) => React.ReactNode
  skeleton:   React.ReactNode
}

export function ScreenState<T>({ isLoading, isError, data, onRetry, children, skeleton }: ScreenStateProps<T>) {
  if (isLoading) return <>{skeleton}</>

  if (isError) return (
    <ErrorState
      title="Something went wrong"
      description="We couldn't load this content. Please try again."
      onRetry={onRetry}
    />
  )

  if (!data) return null

  return <>{children(data)}</>
}
```

Usage:

```tsx
const { data, isLoading, isError, refetch } = useServices()

<ScreenState
  isLoading={isLoading}
  isError={isError}
  data={data}
  onRetry={refetch}
  skeleton={
    <View className="gap-3 px-4">
      {[1,2,3].map(i => <ServiceCardSkeleton key={i} />)}
    </View>
  }
>
  {(services) => (
    <FlatList data={services} ... />
  )}
</ScreenState>
```

---

## Screen Patterns

### Explore / Home screen

```tsx
// app/(tabs)/index.tsx
import { View, Text, FlatList, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Search } from "lucide-react-native"
import { useServices } from "@/features/services/hooks/useServices"
import { ServiceCard } from "@/features/services/components/ServiceCard"
import { ServiceCardSkeleton } from "@/components/ui/LoadingSkeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { router } from "expo-router"

export default function ExploreScreen() {
  const { data: services, isLoading, isError, refetch } = useServices()

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background" edges={["top"]}>

      {/* Header */}
      <View className="px-4 pb-4">
        <Text className="text-foreground dark:text-dark-foreground text-2xl font-bold">
          Find a service
        </Text>
        <Text className="text-secondary dark:text-dark-secondary text-sm mt-1">
          Book trusted professionals
        </Text>
      </View>

      {/* Search */}
      <View className="mx-4 mb-4 flex-row items-center gap-3 bg-card dark:bg-dark-card border border-border dark:border-border-dark rounded-xl px-3 h-11">
        <Search size={18} color="#9CA3AF" />
        <TextInput
          placeholder="Search services..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-foreground dark:text-dark-foreground text-base"
        />
      </View>

      {/* List */}
      {isLoading ? (
        <View className="gap-3 px-4">
          {[1,2,3,4].map(i => <ServiceCardSkeleton key={i} />)}
        </View>
      ) : isError ? (
        <EmptyState
          icon={Search}
          title="Couldn't load services"
          description="Check your connection and try again."
        />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 32 }}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              onPress={(s) => router.push(`/services/${s.id}`)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={Search}
              title="No services found"
              description="Try a different search or check back later."
            />
          }
        />
      )}
    </SafeAreaView>
  )
}
```

### Booking form screen

```tsx
// app/booking/new.tsx
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScreenHeader } from "@/components/ui/ScreenHeader"
import { Button } from "@/components/ui/Button"
import { bookingSchema, type BookingFormValues } from "@/features/bookings/schemas/booking.schema"

export default function NewBookingScreen() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    Keyboard.dismiss()
    // mutation call
  })

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background" edges={["top", "bottom"]}>
      <ScreenHeader title="Book a service" showBack />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date field, address field, notes — use FormField pattern from react-native-forms-rhf-zod skill */}
        </ScrollView>

        <View className="px-4 pb-4 border-t border-border dark:border-border-dark">
          <Button label="Confirm booking" onPress={onSubmit} loading={isSubmitting} fullWidth />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
```

### Booking schema

```ts
// features/bookings/schemas/booking.schema.ts
import { z } from "zod"

export const bookingSchema = z.object({
  serviceId:   z.string().min(1, "Select a service"),
  providerId:  z.string().min(1, "Select a provider"),
  address:     z.string().min(5, "Enter a valid address"),
  scheduledAt: z.string().min(1, "Select a date and time"),
  notes:       z.string().optional(),
})

export type BookingFormValues = z.infer<typeof bookingSchema>
```

---

## Tab Bar

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router"
import { LayoutGrid, CalendarDays, MessageCircle, User } from "lucide-react-native"
import { useColorScheme } from "nativewind"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function TabLayout() {
  const { colorScheme } = useColorScheme()
  const insets = useSafeAreaInsets()
  const isDark = colorScheme === "dark"

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#161B22" : "#FFFFFF",
          borderTopColor:  isDark ? "#2A3B30" : "#D4E8E0",
          borderTopWidth:  0.5,
          height:          56 + insets.bottom,
          paddingBottom:   insets.bottom,
        },
        tabBarActiveTintColor:   isDark ? "#4BB88A" : "#1B6B52",
        tabBarInactiveTintColor: isDark ? "#4B6055" : "#9CA3AF",
        tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter_500Medium" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
```

---

## Domain Vocabulary

| Concept | Term | Notes |
|---------|------|-------|
| Person hiring | **Homeowner** / **Client** | Not "user" in UI copy |
| Person providing service | **Provider** / **Pro** | Not "worker" or "vendor" |
| A service category | **Service** | Cleaning, Plumbing, etc. |
| A scheduled appointment | **Booking** | Not "appointment" or "reservation" |
| Booking cost | **Total** or **Price** | Not "amount" |
| Pro is free | **Available** | Not "online" or "active" |
| Pro is occupied | **Busy** | Not "offline" |
| Job finished | **Completed** | Not "done" or "closed" |
| Cancel a booking | **Cancel booking** | Not "delete" |
| Leave feedback | **Write a review** | Not "rate" |

---

## Shipping Checklist

- [ ] All colors via NativeWind tokens — no hardcoded hex in JSX (except `serviceStyles` which is intentional)
- [ ] Dark mode paired on every `bg-*`, `text-*`, `border-*` class
- [ ] All 4 UX states handled: loading (skeleton), error, empty, data
- [ ] Loading uses skeleton components — not `ActivityIndicator` alone
- [ ] `FlatList` used for all lists — never `ScrollView` for data lists
- [ ] `KeyboardAvoidingView` + `keyboardShouldPersistTaps="handled"` on all forms
- [ ] `SafeAreaView` with correct `edges` on every screen
- [ ] All forms use RHF + Zod with `Controller` — no uncontrolled inputs
- [ ] Booking schema tested independently of the form
- [ ] `categoryStyles` used for service icons — no hardcoded icon colors
- [ ] `BookingStatusBadge` used for all booking status displays
- [ ] `EmptyState` component used — no bare "No results" text
- [ ] Tab bar height accounts for `useSafeAreaInsets().bottom`
- [ ] Domain vocabulary consistent (Booking, Provider, Available, Completed)
