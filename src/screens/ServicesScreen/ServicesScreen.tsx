import { useCallback, useEffect, useRef } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';

import { CategoryChip } from '@/components/CategoryChip/CategoryChip';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { LoadingState } from '@/components/LoadingState/LoadingState';
import { ServiceCard } from '@/components/ServiceCard/ServiceCard';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/service';
import { CATEGORY_OPTIONS } from '@/data/categories';

export default function ServicesScreen() {
  const {
    featuredServices,
    filteredServices,
    isLoading,
    error,
    retry,
    activeCategory,
    setActiveCategory,
  } = useServices();

  const chipScrollRef = useRef<ScrollView>(null);
  const chipPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    const x = chipPositions.current[activeCategory];
    if (x !== undefined && chipScrollRef.current) {
      chipScrollRef.current.scrollTo({ x: Math.max(0, x - 24), animated: true });
    }
  }, [activeCategory]);

  const renderServiceItem = useCallback(
    ({ item }: { item: Service }) => (
      <ServiceCard
        service={item}
        onPress={() => router.push(`/services/${item.id}`)}
      />
    ),
    [],
  );

  const renderHeader = useCallback(
    () => (
      <>
        <Text style={{ fontSize: 19, fontWeight: '600', marginBottom: 10 }}>Featured</Text>
        <View style={{ marginBottom: 14 }}>
          {featuredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              variant="featured"
              onPress={() => router.push(`/services/${service.id}`)}
            />
          ))}
        </View>

        <Text style={{ fontSize: 19, fontWeight: '600', marginBottom: 10 }}>Categories</Text>
        <ScrollView
          ref={chipScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 14 }}
        >
          {CATEGORY_OPTIONS.map((category) => (
            <CategoryChip
              key={category.value}
              label={category.label}
              category={category.value}
              isActive={category.value === activeCategory}
              onPress={setActiveCategory}
              onLayout={(e) => {
                chipPositions.current[category.value] = e.nativeEvent.layout.x;
              }}
            />
          ))}
        </ScrollView>

        <Text style={{ fontSize: 19, fontWeight: '600', marginBottom: 10 }}>All Services</Text>
      </>
    ),
    [activeCategory, featuredServices, setActiveCategory],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredServices}
        keyExtractor={(service) => service.id}
        renderItem={renderServiceItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
