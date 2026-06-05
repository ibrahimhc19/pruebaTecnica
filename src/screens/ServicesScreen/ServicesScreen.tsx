import { useCallback } from 'react';
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
              onPress={setActiveCategory}
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
