import { Pressable, Text, View } from 'react-native';

import { CATEGORY_LABELS } from '@/data/categories';
import { uiColors } from '@/theme/uiTokens';
import { formatCurrency } from '@/utils/formatCurrency';
import { CATEGORY_COLORS } from '@/utils/categoryColors';
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
  const isFeatured = variant === 'featured';
  const badgeText = service.available ? 'Available' : 'Unavailable';
  const chipColors = CATEGORY_COLORS[service.category];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(service)}
      style={{
        borderWidth: 1,
        borderColor: uiColors.border.default,
        borderRadius: 12,
        padding: isFeatured ? 12 : 16,
        marginBottom: 12,
        backgroundColor: isFeatured ? uiColors.surface.featured : uiColors.surface.base,
      }}
    >
      <View style={{ gap: isFeatured ? 6 : 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: isFeatured ? 15 : 18, fontWeight: '600', flexShrink: 1 }}>
            {service.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              color: chipColors.text,
              backgroundColor: chipColors.bg,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 6,
              overflow: 'hidden',
              marginLeft: 8,
            }}
          >
            {CATEGORY_LABELS[service.category]}
          </Text>
        </View>

        {!isFeatured && (
          <Text style={{ color: uiColors.text.secondary }}>{service.description}</Text>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontWeight: isFeatured ? '700' : '500', fontSize: isFeatured ? 16 : 15 }}>
            {formatCurrency(service.price, service.currency)}
          </Text>
          {isFeatured ? (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 6,
                backgroundColor: service.available
                  ? uiColors.surface.success
                  : uiColors.surface.danger,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: service.available
                    ? uiColors.border.success
                    : uiColors.border.danger,
                }}
              >
                {badgeText}
              </Text>
            </View>
          ) : (
            <Text style={{ color: uiColors.text.secondary }}>
              {service.rating.toFixed(1)} ★ ({service.reviewCount})
            </Text>
          )}
        </View>

        {!isFeatured && (
          <Text style={{ color: service.available ? uiColors.border.success : uiColors.border.danger }}>
            {badgeText}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
