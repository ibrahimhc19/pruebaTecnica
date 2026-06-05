import { useEffect } from 'react';
import { ScrollView } from 'react-native';

import { CategoryChip } from '@/components/CategoryChip/CategoryChip';
import { CATEGORY_OPTIONS } from '@/data/categories';
import { ServiceCategory } from '@/types/service';

interface CategoriesBarProps {
  activeCategory: ServiceCategory;
  onSelect: (category: ServiceCategory) => void;
}

export function CategoriesBar({
  activeCategory,
  onSelect,
}: CategoriesBarProps) {
  useEffect(() => {
    console.log('Categories mounted');

    return () => {
      console.log('Categories unmounted');
    };
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 14 }}
    >
      {CATEGORY_OPTIONS.map((item) => (
        <CategoryChip
          key={item.value}
          label={item.label}
          category={item.value}
          isActive={item.value === activeCategory}
          onPress={onSelect}
        />
      ))}
    </ScrollView>
  );
}
