import { useCallback, useEffect, useRef } from 'react';
import { FlatList, Text, View } from 'react-native';
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

  const chipListRef = useRef<FlatList<(typeof CATEGORY_OPTIONS)[number]>>(null);

  const scrollToChip = useCallback((category: string) => {
    const index = CATEGORY_OPTIONS.findIndex((c) => c.value === category);
    if (index === -1 || !chipListRef.current) return;
    chipListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => scrollToChip(activeCategory), 0);
    return () => clearTimeout(timeout);
  }, [activeCategory, scrollToChip]);

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
        <FlatList
          ref={chipListRef}
          horizontal
          data={CATEGORY_OPTIONS}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <CategoryChip
              label={item.label}
              category={item.value}
              isActive={item.value === activeCategory}
              onPress={setActiveCategory}
            />
          )}
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 14 }}
        />

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
