import { Pressable, Text, View } from 'react-native';

import { uiColors } from '@/theme/uiTokens';
import { formatCurrency } from '@/utils/formatCurrency';
import { Service } from '@/types/service';

interface ServiceCardProps {
  service: Service;
  onPress?: (service: Service) => void;
  variant?: 'default' | 'featured';
}

export function ServiceCard({
  service,
  onPress,
  variant = 'default',
}: ServiceCardProps) {
  const badgeText = service.isAvailable ? 'Available' : 'Unavailable';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(service)}
      style={{
        borderWidth: 1,
        borderColor: uiColors.border.default,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        backgroundColor: variant === 'featured' ? uiColors.surface.featured : uiColors.surface.base,
      }}
    >
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{service.title}</Text>
        <Text style={{ color: uiColors.text.secondary }}>{service.description}</Text>
        <Text style={{ fontWeight: '500' }}>{formatCurrency(service.basePrice)}</Text>
        <Text style={{ color: service.isAvailable ? uiColors.border.success : uiColors.border.danger }}>
          {badgeText}
        </Text>
      </View>
    </Pressable>
  );
}
