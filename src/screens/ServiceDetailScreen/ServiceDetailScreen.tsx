import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ScreenLayout } from '@/components/ScreenLayout/ScreenLayout';
import { useServiceDetail } from '@/hooks/useServiceDetail';
import { uiColors } from '@/theme/uiTokens';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { service } = useServiceDetail(id);

  if (!service) {
    return (
      <ScreenLayout title="Service Details">
        <EmptyState title="Service not found" description="The selected service does not exist." />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Service Details">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 36 }}>
        <Text style={{ fontSize: 26, fontWeight: '700' }}>{service.title}</Text>
        <Text style={{ color: uiColors.text.secondary }}>{service.description}</Text>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Starting at {formatCurrency(service.basePrice)}</Text>

        <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: uiColors.border.default,
            padding: 12,
            gap: 6,
          }}
        >
          <Text style={{ color: uiColors.text.muted }}>Category: {service.category}</Text>
          <Text style={{ color: uiColors.text.muted }}>
            Duration: {service.estimatedDurationMinutes} minutes
          </Text>
          <Text style={{ color: uiColors.text.muted }}>
            Rating: {service.providerRating.toFixed(1)} ({service.reviewCount} reviews)
          </Text>
          <Text style={{ color: uiColors.text.muted }}>Featured: {service.isFeatured ? 'Yes' : 'No'}</Text>
        </View>

        <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: service.isAvailable ? uiColors.border.success : uiColors.border.danger,
            padding: 12,
            backgroundColor: service.isAvailable ? uiColors.surface.success : uiColors.surface.danger,
          }}
        >
          <Text style={{ color: service.isAvailable ? uiColors.text.success : uiColors.text.danger, fontWeight: '600' }}>
            {service.isAvailable ? 'Available now' : 'Currently unavailable'}
          </Text>
          {!service.isAvailable && service.unavailableReason ? (
            <Text style={{ color: uiColors.text.danger, marginTop: 6 }}>{service.unavailableReason}</Text>
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
            paddingVertical: 14,
            paddingHorizontal: 14,
            alignItems: 'center',
            backgroundColor: service.isAvailable ? uiColors.brand.primary : uiColors.state.disabled,
            opacity: service.isAvailable ? 1 : 0.75,
          }}
        >
          <Text style={{ color: uiColors.text.inverse, fontWeight: '700' }}>Request Service</Text>
        </Pressable>
      </ScrollView>
    </ScreenLayout>
  );
}
