import { useCallback } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { EmptyState } from '@/components/EmptyState/EmptyState';
import { RequestForm } from '@/components/RequestForm/RequestForm';
import { ScreenLayout } from '@/components/ScreenLayout/ScreenLayout';
import { useRequestService } from '@/hooks/useRequestService';
import { useServiceDetail } from '@/hooks/useServiceDetail';
import { uiColors } from '@/theme/uiTokens';
import { ServiceRequestFormValues } from '@/types/request';

export default function RequestFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { service } = useServiceDetail(id);

  const { isSubmitting, submitError, submitSuccess, submit, clearFeedback } = useRequestService();

  const handleSubmit = useCallback(
    async (values: ServiceRequestFormValues) => {
      if (!service) {
        return;
      }

      await submit(service.id, values);
    },
    [service, submit],
  );

  if (!service) {
    return (
      <ScreenLayout>
        <EmptyState title="Service not found" description="Cannot create request for this service." />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 36 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 20, fontWeight: '700' }}>{service.name}</Text>

          {!service.available ? (
            <>
              <Text style={{ color: uiColors.text.danger }}>
                This service is currently unavailable. Try another service or come back later.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.back()}
                style={{
                  marginTop: 8,
                  borderRadius: 10,
                  paddingVertical: 14,
                  paddingHorizontal: 14,
                  alignItems: 'center',
                  backgroundColor: uiColors.brand.primary,
                }}
              >
                <Text style={{ color: uiColors.text.inverse, fontWeight: '700' }}>Back to Details</Text>
              </Pressable>
            </>
          ) : submitSuccess ? (
            <View
              style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor: uiColors.border.success,
                backgroundColor: uiColors.surface.success,
                padding: 12,
                gap: 6,
              }}
            >
              <Text style={{ color: uiColors.text.success, fontWeight: '700' }}>Request submitted successfully</Text>
              <Text style={{ color: uiColors.text.success }}>{submitSuccess.message}</Text>
              <Text style={{ color: uiColors.text.success }}>Reference: {submitSuccess.requestId}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                <Pressable
                  accessibilityRole="button"
                  onPress={clearFeedback}
                  style={{
                    flex: 1,
                    borderRadius: 8,
                    paddingVertical: 10,
                    alignItems: 'center',
                    backgroundColor: uiColors.brand.primary,
                  }}
                >
                  <Text style={{ color: uiColors.text.inverse, fontWeight: '600' }}>Create Another Request</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.replace('/')}
                  style={{
                    flex: 1,
                    borderRadius: 8,
                    paddingVertical: 10,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: uiColors.border.success,
                  }}
                >
                  <Text style={{ color: uiColors.text.success, fontWeight: '600' }}>Back to Home</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              {submitError ? (
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: uiColors.border.danger,
                    backgroundColor: uiColors.surface.danger,
                    padding: 12,
                    gap: 6,
                  }}
                >
                  <Text style={{ color: uiColors.text.danger, fontWeight: '700' }}>Request failed</Text>
                  <Text style={{ color: uiColors.text.danger }}>{submitError}</Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={clearFeedback}
                    style={{
                      marginTop: 6,
                      borderRadius: 8,
                      paddingVertical: 10,
                      alignItems: 'center',
                      backgroundColor: uiColors.border.danger,
                    }}
                  >
                    <Text style={{ color: uiColors.text.white, fontWeight: '600' }}>Dismiss Error</Text>
                  </Pressable>
                </View>
              ) : null}

              <RequestForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}
