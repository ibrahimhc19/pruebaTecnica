import { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';

import { CategoriesBar } from '@/components/CategoryChip/CategoriesBar';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { LoadingState } from '@/components/LoadingState/LoadingState';
import { ServiceCard } from '@/components/ServiceCard/ServiceCard';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/service';

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
        ListHeaderComponent={
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

            <CategoriesBar
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />

            <Text style={{ fontSize: 19, fontWeight: '600', marginBottom: 10 }}>All Services</Text>
          </>
        }
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
