import { Pressable, Text } from 'react-native';

import { ServiceCategory } from '@/types/service';

interface CategoryChipProps {
  label: string;
  category: ServiceCategory;
  isActive: boolean;
  onPress: (category: ServiceCategory) => void;
}

export function CategoryChip({
  label,
  category,
  isActive,
  onPress,
}: CategoryChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(category)}
      style={{
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginRight: 8,
        borderWidth: 1,
        borderColor: isActive ? '#0f766e' : '#d1d5db',
        backgroundColor: isActive ? '#ccfbf1' : '#f9fafb',
      }}
    >
      <Text style={{ color: isActive ? '#115e59' : '#374151', fontWeight: '500' }}>{label}</Text>
    </Pressable>
  );
}
