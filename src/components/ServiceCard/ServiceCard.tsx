import { Pressable, Text, View } from 'react-native';

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
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        backgroundColor: variant === 'featured' ? '#e0f7fa' : '#ffffff',
      }}
    >
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{service.title}</Text>
        <Text style={{ color: '#4b5563' }}>{service.description}</Text>
        <Text style={{ fontWeight: '500' }}>{formatCurrency(service.basePrice)}</Text>
        <Text style={{ color: service.isAvailable ? '#15803d' : '#b91c1c' }}>{badgeText}</Text>
      </View>
    </Pressable>
  );
}
