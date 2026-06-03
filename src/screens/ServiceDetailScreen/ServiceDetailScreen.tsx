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
<ScreenLayout>
        <EmptyState title="Service not found" description="The selected service does not exist." />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 36 }}>
        <Text style={{ fontSize: 26, fontWeight: '700' }}>{service.name}</Text>
        <Text style={{ color: uiColors.text.secondary }}>{service.description}</Text>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Starting at {formatCurrency(service.price, service.currency)}</Text>

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
            Duration: {service.durationMinutes} minutes
          </Text>
          <Text style={{ color: uiColors.text.muted }}>
            Rating: {service.rating.toFixed(1)} ({service.reviewCount} reviews)
          </Text>
          <Text style={{ color: uiColors.text.muted }}>Provider: {service.providerName}</Text>
        </View>

        <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: service.available ? uiColors.border.success : uiColors.border.danger,
            padding: 12,
            backgroundColor: service.available ? uiColors.surface.success : uiColors.surface.danger,
          }}
        >
          <Text style={{ color: service.available ? uiColors.text.success : uiColors.text.danger, fontWeight: '600' }}>
            {service.available ? 'Available now' : 'Currently unavailable'}
          </Text>
          {!service.available && service.unavailableReason ? (
            <Text style={{ color: uiColors.text.danger, marginTop: 6 }}>{service.unavailableReason}</Text>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!service.available}
          onPress={() => {
            router.push(`/services/${service.id}/request`);
          }}
          style={{
            marginTop: 12,
            borderRadius: 10,
            paddingVertical: 14,
            paddingHorizontal: 14,
            alignItems: 'center',
            backgroundColor: service.available ? uiColors.brand.primary : uiColors.state.disabled,
            opacity: service.available ? 1 : 0.75,
          }}
        >
          <Text style={{ color: uiColors.text.inverse, fontWeight: '700' }}>Request Service</Text>
        </Pressable>
      </ScrollView>
    </ScreenLayout>
  );
}
