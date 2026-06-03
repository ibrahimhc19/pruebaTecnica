import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';

import { requestFormSchema } from '@/types/request.schema';
import { ServiceRequestFormValues } from '@/types/request';
import { uiColors } from '@/theme/uiTokens';

interface RequestFormProps {
  isSubmitting: boolean;
  onSubmit: (values: ServiceRequestFormValues) => Promise<void>;
}

const defaultValues: ServiceRequestFormValues = {
  fullName: '',
  phoneNumber: '',
  preferredDate: '',
};

export function RequestForm({ isSubmitting, onSubmit }: RequestFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ServiceRequestFormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(requestFormSchema),
  });

  const onSubmitForm = handleSubmit(async (values) => {
    Keyboard.dismiss();
    await onSubmit(values);
  });

  return (
    <View style={{ gap: 12 }}>
      <View>
        <Text style={{ fontWeight: '600', marginBottom: 6 }}>Full Name</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              returnKeyType="next"
              placeholder="John Doe"
              style={{
                borderWidth: 1,
                borderColor: errors.fullName ? uiColors.border.danger : uiColors.border.default,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
          )}
        />
        {errors.fullName ? (
          <Text style={{ color: uiColors.border.danger, marginTop: 5 }}>{errors.fullName.message}</Text>
        ) : null}
      </View>

      <View>
        <Text style={{ fontWeight: '600', marginBottom: 6 }}>Phone Number</Text>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="phone-pad"
              autoCapitalize="none"
              returnKeyType="next"
              placeholder="+1 555 123 4567"
              style={{
                borderWidth: 1,
                borderColor: errors.phoneNumber ? uiColors.border.danger : uiColors.border.default,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
          )}
        />
        {errors.phoneNumber ? (
          <Text style={{ color: uiColors.border.danger, marginTop: 5 }}>{errors.phoneNumber.message}</Text>
        ) : null}
      </View>

      <View>
        <Text style={{ fontWeight: '600', marginBottom: 6 }}>Preferred Date</Text>
        <Controller
          control={control}
          name="preferredDate"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              returnKeyType="done"
              placeholder="YYYY-MM-DD"
              style={{
                borderWidth: 1,
                borderColor: errors.preferredDate ? uiColors.border.danger : uiColors.border.default,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
          )}
        />
        {errors.preferredDate ? (
          <Text style={{ color: uiColors.border.danger, marginTop: 5 }}>{errors.preferredDate.message}</Text>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={!isValid || isSubmitting}
        onPress={onSubmitForm}
        style={{
          marginTop: 4,
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 14,
          alignItems: 'center',
          backgroundColor: !isValid || isSubmitting ? uiColors.state.disabled : uiColors.brand.primary,
        }}
      >
        <Text style={{ color: uiColors.text.inverse, fontWeight: '700' }}>
          {isSubmitting ? 'Submitting request...' : 'Submit Request'}
        </Text>
      </Pressable>
    </View>
  );
}
