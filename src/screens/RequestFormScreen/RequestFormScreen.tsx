import { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { EmptyState } from '@/components/EmptyState/EmptyState';
import { RequestForm } from '@/components/RequestForm/RequestForm';
import { getServiceById } from '@/data/services';
import { useRequestService } from '@/hooks/useRequestService';
import { ServiceRequestFormValues } from '@/types/request';

export default function RequestFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const service = useMemo(() => getServiceById(id), [id]);

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
    return <EmptyState title="Service not found" description="Cannot create request for this service." />;
  }

  if (!service.isAvailable) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Request Service</Text>
        <Text style={{ color: '#4b5563' }}>{service.title}</Text>
        <Text style={{ color: '#991b1b' }}>
          This service is currently unavailable. Try another service or come back later.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={{
            marginTop: 8,
            borderRadius: 10,
            paddingVertical: 11,
            paddingHorizontal: 14,
            alignItems: 'center',
            backgroundColor: '#0f766e',
          }}
        >
          <Text style={{ color: '#f0fdfa', fontWeight: '700' }}>Back to Details</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 36 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Request Service</Text>
      <Text style={{ color: '#4b5563' }}>Service: {service.title}</Text>

      {submitSuccess ? (
        <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#15803d',
            backgroundColor: '#f0fdf4',
            padding: 12,
            gap: 6,
          }}
        >
          <Text style={{ color: '#166534', fontWeight: '700' }}>Request submitted successfully</Text>
          <Text style={{ color: '#166534' }}>{submitSuccess.message}</Text>
          <Text style={{ color: '#166534' }}>Reference: {submitSuccess.requestId}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={clearFeedback}
            style={{
              marginTop: 6,
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor: '#0f766e',
            }}
          >
            <Text style={{ color: '#f0fdfa', fontWeight: '600' }}>Create Another Request</Text>
          </Pressable>
        </View>
      ) : null}

      {submitError ? (
        <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#b91c1c',
            backgroundColor: '#fef2f2',
            padding: 12,
            gap: 6,
          }}
        >
          <Text style={{ color: '#991b1b', fontWeight: '700' }}>Request failed</Text>
          <Text style={{ color: '#991b1b' }}>{submitError}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={clearFeedback}
            style={{
              marginTop: 6,
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor: '#b91c1c',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Dismiss Error</Text>
          </Pressable>
        </View>
      ) : null}

      <RequestForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </ScrollView>
  );
}
