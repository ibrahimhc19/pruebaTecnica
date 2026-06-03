import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { EmptyState } from '@/components/EmptyState/EmptyState';
import { getServiceById } from '@/data/services';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const service = useMemo(() => getServiceById(id), [id]);

  if (!service) {
    return <EmptyState title="Service not found" description="The selected service does not exist." />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 26, fontWeight: '700' }}>{service.title}</Text>
      <Text style={{ color: '#4b5563' }}>{service.description}</Text>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>Starting at {formatCurrency(service.basePrice)}</Text>

      <View style={{ borderRadius: 10, borderWidth: 1, borderColor: '#d1d5db', padding: 12, gap: 6 }}>
        <Text style={{ color: '#374151' }}>Category: {service.category}</Text>
        <Text style={{ color: '#374151' }}>
          Duration: {service.estimatedDurationMinutes} minutes
        </Text>
        <Text style={{ color: '#374151' }}>
          Rating: {service.providerRating.toFixed(1)} ({service.reviewCount} reviews)
        </Text>
        <Text style={{ color: '#374151' }}>Featured: {service.isFeatured ? 'Yes' : 'No'}</Text>
      </View>

      <View
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: service.isAvailable ? '#15803d' : '#b91c1c',
          padding: 12,
          backgroundColor: service.isAvailable ? '#f0fdf4' : '#fef2f2',
        }}
      >
        <Text style={{ color: service.isAvailable ? '#166534' : '#991b1b', fontWeight: '600' }}>
          {service.isAvailable ? 'Available now' : 'Currently unavailable'}
        </Text>
        {!service.isAvailable && service.unavailableReason ? (
          <Text style={{ color: '#991b1b', marginTop: 6 }}>{service.unavailableReason}</Text>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={!service.isAvailable}
        onPress={() => {
          router.push(`/services/${service.id}/request`);
        }}
        style={{
          marginTop: 12,
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 14,
          alignItems: 'center',
          backgroundColor: service.isAvailable ? '#0f766e' : '#9ca3af',
          opacity: service.isAvailable ? 1 : 0.75,
        }}
      >
        <Text style={{ color: '#f0fdfa', fontWeight: '700' }}>Request Service</Text>
      </Pressable>
    </ScrollView>
  );
}
