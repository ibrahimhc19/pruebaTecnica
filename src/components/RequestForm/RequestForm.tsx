import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Platform, Pressable, Text, TextInput, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { requestFormSchema } from '@/types/request.schema';
import { ServiceRequestFormValues } from '@/types/request';
import { uiColors } from '@/theme/uiTokens';
import { formatDate } from '@/utils/formatDate';

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

  const [showDatePicker, setShowDatePicker] = useState(false);

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
          render={({ field: { value, onChange } }) => (
            <>
              <Pressable
                onPress={() => setShowDatePicker((prev) => !prev)}
                style={{
                  borderWidth: 1,
                  borderColor: errors.preferredDate ? uiColors.border.danger : uiColors.border.default,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: value ? uiColors.text.primary : uiColors.text.muted }}>
                  {value || 'Select preferred date'}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={value ? new Date(value.replace(/-/g, '/')) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  minimumDate={new Date()}
                  onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                    if (Platform.OS !== 'ios') {
                      setShowDatePicker(false);
                    }
                    if (event.type === 'set' && selectedDate) {
                      onChange(formatDate(selectedDate));
                      if (Platform.OS === 'ios') {
                        setShowDatePicker(false);
                      }
                    }
                    if (event.type === 'dismissed') {
                      setShowDatePicker(false);
                    }
                  }}
                />
              )}
            </>
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
