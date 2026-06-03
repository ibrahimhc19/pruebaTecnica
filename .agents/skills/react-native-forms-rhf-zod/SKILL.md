---
name: react-native-forms-rhf-zod
description: Form patterns for React Native using React Hook Form and Zod. Covers TextInput quirks, onChangeText vs onChange, Select/Picker alternatives, keyboard management, numeric inputs, and validation feedback. Schemas are reusable from the web project.
---

# React Native Forms — React Hook Form + Zod

Stack: React Hook Form · Zod · React Native · NativeWind · Expo  
Scope: form setup, input bindings, validation display, keyboard handling, numeric fields, select fields

---

## Core Principles

- **Zod schemas are portable** — reuse schemas from the web project directly, no changes needed
- RHF works in RN but `Controller` is required — there is no `register` for native inputs
- `TextInput` uses `onChangeText` (string) not `onChange` (event) — `Controller` bridges this
- Always wrap forms in `KeyboardAvoidingView` + `ScrollView`
- Use `z.coerce.number()` for numeric inputs — `TextInput` always returns strings
- Dismiss the keyboard on form submit

---

## Setup

```bash
npx expo install react-hook-form zod @hookform/resolvers
```

No additional setup needed — same packages as web.

---

## Schema — reusable from web

```ts
// features/students/schemas/enrollment.schema.ts
// Identical to the web schema — fully portable
import { z } from "zod"

export const enrollmentSchema = z.object({
  nombre:      z.string().min(2, "El nombre es requerido"),
  documento:   z.string().min(5, "Documento inválido"),
  sede:        z.string({ required_error: "Selecciona una sede" }),
  grupo:       z.string({ required_error: "Selecciona un grupo" }),
  mensualidad: z.coerce.number().positive("Debe ser mayor a 0"),
})

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>
```

---

## Base Form Pattern

```tsx
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  View, Text, TextInput, Pressable, ScrollView,
  KeyboardAvoidingView, Platform, Keyboard, StyleSheet,
} from "react-native"
import { enrollmentSchema, EnrollmentFormValues } from "../schemas/enrollment.schema"

interface Props {
  onSubmit: (values: EnrollmentFormValues) => Promise<void>
}

export function EnrollmentForm({ onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { nombre: "", documento: "", sede: "", grupo: "", mensualidad: 0 },
  })

  const submit = handleSubmit(async (values) => {
    Keyboard.dismiss()
    await onSubmit(values)
  })

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        <FormField
          label="Nombre del estudiante"
          error={errors.nombre?.message}
        >
          <Controller
            control={control}
            name="nombre"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.nombre && styles.inputError]}
                placeholder="Nombre completo"
                placeholderTextColor="#737588"
                onChangeText={onChange}   // RN uses onChangeText, not onChange
                onBlur={onBlur}
                value={value}
                autoCapitalize="words"
                returnKeyType="next"
              />
            )}
          />
        </FormField>

        <FormField
          label="Documento"
          error={errors.documento?.message}
        >
          <Controller
            control={control}
            name="documento"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.documento && styles.inputError]}
                placeholder="Número de documento"
                placeholderTextColor="#737588"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                keyboardType="numeric"
                returnKeyType="next"
              />
            )}
          />
        </FormField>

        <FormField
          label="Mensualidad"
          error={errors.mensualidad?.message}
        >
          <Controller
            control={control}
            name="mensualidad"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.prefixContainer}>
                <Text style={styles.prefix}>$</Text>
                <TextInput
                  style={[styles.input, styles.inputWithPrefix, errors.mensualidad && styles.inputError]}
                  placeholder="0"
                  placeholderTextColor="#737588"
                  onChangeText={onChange}   // z.coerce.number() handles string→number
                  onBlur={onBlur}
                  value={value === 0 ? "" : String(value)}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
            )}
          />
        </FormField>

        <Pressable
          onPress={submit}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.button,
            (pressed || isSubmitting) && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonLabel}>
            {isSubmitting ? "Guardando..." : "Registrar matrícula"}
          </Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

// Reusable field wrapper
function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContent:    { padding: 16, paddingBottom: 48 },
  fieldContainer:   { marginBottom: 16 },
  label:            { fontSize: 14, fontWeight: "500", color: "#18191F", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#D5D7E8",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#18191F",
    backgroundColor: "#fff",
  },
  inputError:       { borderColor: "#DC2626" },
  prefixContainer:  { flexDirection: "row", alignItems: "center" },
  prefix:           { position: "absolute", left: 12, zIndex: 1, fontSize: 15, color: "#737588" },
  inputWithPrefix:  { flex: 1, paddingLeft: 28 },
  errorText:        { fontSize: 12, color: "#DC2626", marginTop: 4 },
  button: {
    backgroundColor: "#2C3073",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed:    { opacity: 0.8 },
  buttonLabel:      { color: "#E8EAFC", fontSize: 15, fontWeight: "600" },
})
```

---

## Select / Picker Fields

React Native has no `<select>`. Options from best to worst:

### Option 1 — Bottom Sheet (recommended)

Use `@gorhom/bottom-sheet` or a modal to show options. Best UX on mobile.

```tsx
import { useState } from "react"
import { Modal, View, Text, Pressable, FlatList, StyleSheet } from "react-native"
import { Controller } from "react-hook-form"

const SEDES = [{ label: "Aranjuez", value: "aranjuez" }]
const GRUPOS = [
  { label: "Lun/Mié 7:00 am", value: "lun-mie-7" },
  { label: "Mar/Jue 6:00 pm", value: "mar-jue-6" },
]

function SelectField({
  options,
  value,
  onChange,
  placeholder,
  error,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string
}) {
  const [visible, setVisible] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.selectTrigger, error && styles.inputError]}
      >
        <Text style={[styles.selectText, !selected && styles.placeholder]}>
          {selected?.label ?? placeholder}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={visible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)} />
        <View style={styles.modalSheet}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => { onChange(item.value); setVisible(false) }}
                style={[styles.option, item.value === value && styles.optionSelected]}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </>
  )
}
```

### Option 2 — Expo Picker (simpler, less control)

```bash
npx expo install @react-native-picker/picker
```

```tsx
import { Picker } from "@react-native-picker/picker"
import { Controller } from "react-hook-form"

<Controller
  control={control}
  name="sede"
  render={({ field: { onChange, value } }) => (
    <Picker selectedValue={value} onValueChange={onChange}>
      <Picker.Item label="Seleccionar sede" value="" />
      <Picker.Item label="Aranjuez" value="aranjuez" />
    </Picker>
  )}
/>
```

---

## Numeric Input Rules

`TextInput` always returns strings. Use `z.coerce.number()` in the schema — never parse manually.

```ts
// Schema handles coercion
mensualidad: z.coerce.number().positive("Debe ser mayor a 0")

// Input
<TextInput
  keyboardType="numeric"
  onChangeText={onChange}      // passes string to RHF
  value={value === 0 ? "" : String(value)}  // display: hide 0, show number
/>
```

### Clearing the field

The default value `0` shows as "0" in the input — which users have to delete before typing. Use `""` as default and coerce on submit:

```ts
defaultValues: { mensualidad: "" as unknown as number }
// z.coerce.number() will convert "" to NaN → fails .positive() validation
```

---

## Multi-step Forms

For enrollment wizards or multi-step flows, persist form state with `useForm` at the parent level and pass `control` down.

```tsx
// Parent — owns the form state
const form = useForm<EnrollmentFormValues>({ resolver: zodResolver(enrollmentSchema) })

// Step 1 — receives control as prop
<PersonalInfoStep control={form.control} errors={form.formState.errors} />

// Step 2
<GroupSelectionStep control={form.control} errors={form.formState.errors} />

// Final submit — parent calls handleSubmit
<Pressable onPress={form.handleSubmit(onSubmit)}>
  <Text>Confirmar matrícula</Text>
</Pressable>
```

---

## TextInput Props Reference

| Prop | Value | When |
|------|-------|------|
| `keyboardType` | `"numeric"` | Numbers only (allows decimals) |
| `keyboardType` | `"phone-pad"` | Phone numbers |
| `keyboardType` | `"email-address"` | Email fields |
| `autoCapitalize` | `"words"` | Name fields |
| `autoCapitalize` | `"none"` | Emails, usernames |
| `autoCorrect` | `false` | IDs, codes, emails |
| `secureTextEntry` | `true` | Passwords |
| `returnKeyType` | `"next"` | Move to next field |
| `returnKeyType` | `"done"` | Last field in form |
| `maxLength` | number | Bounded fields |

---

## Anti-patterns

| Anti-pattern | Why | Instead |
|---|---|---|
| `register()` for native inputs | Doesn't work in RN — no DOM refs | Use `Controller` always |
| `onChange` instead of `onChangeText` | `onChange` receives an event object, not a string | `onChangeText={field.onChange}` |
| Manual `parseInt` / `parseFloat` | Brittle | `z.coerce.number()` in schema |
| Missing `KeyboardAvoidingView` | Keyboard covers inputs | Wrap every form |
| Missing `keyboardShouldPersistTaps` | Tapping submit dismisses keyboard instead | Set to `"handled"` on ScrollView |
| `<Picker>` inside `ScrollView` | Scroll conflict on Android | Use modal/bottom sheet pattern |
| Not calling `Keyboard.dismiss()` on submit | Keyboard stays open after submit | Always dismiss in submit handler |
