import { Pressable, Text, type LayoutChangeEvent } from 'react-native';

import { uiColors } from '@/theme/uiTokens';
import { ServiceCategory } from '@/types/service';

interface CategoryChipProps {
  label: string;
  category: ServiceCategory;
  isActive: boolean;
  onPress: (category: ServiceCategory) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export function CategoryChip({
  label,
  category,
  isActive,
  onPress,
  onLayout,
}: CategoryChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(category)}
      onLayout={onLayout}
      style={{
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginRight: 8,
        borderWidth: 1,
        borderColor: isActive ? uiColors.brand.primary : uiColors.border.default,
        backgroundColor: isActive ? uiColors.surface.chipActive : uiColors.surface.subtle,
      }}
    >
      <Text style={{ color: isActive ? uiColors.brand.chipActiveText : uiColors.text.muted, fontWeight: '500' }}>
        {label}
      </Text>
    </Pressable>
  );
}
