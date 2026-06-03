import { FlatList, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';

import { CategoryChip } from '@/components/CategoryChip/CategoryChip';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { LoadingState } from '@/components/LoadingState/LoadingState';
import { ServiceCard } from '@/components/ServiceCard/ServiceCard';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/service';
import { uiColors } from '@/theme/uiTokens';

import { CATEGORY_OPTIONS } from './constants';

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

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  const renderServiceItem = ({ item }: { item: Service }) => (
    <ServiceCard
      service={item}
      onPress={() => router.push(`/services/${item.id}`)}
    />
  );

  return (
    <FlatList
      data={filteredServices}
      keyExtractor={(service) => service.id}
      renderItem={renderServiceItem}
      contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
      ListHeaderComponent={(
        <>
          <Text style={{ fontSize: 26, fontWeight: '700', marginBottom: 6 }}>Services</Text>
          <Text style={{ color: uiColors.text.secondary, marginBottom: 14 }}>
            Browse home service options and request support quickly.
          </Text>

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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            {CATEGORY_OPTIONS.map((category) => (
              <CategoryChip
                key={category.value}
                label={category.label}
                category={category.value}
                isActive={category.value === activeCategory}
                onPress={setActiveCategory}
              />
            ))}
          </ScrollView>

          <Text style={{ fontSize: 19, fontWeight: '600', marginBottom: 10 }}>All Services</Text>
        </>
      )}
      ListEmptyComponent={<EmptyState />}
      showsVerticalScrollIndicator={false}
    />
  );
}
