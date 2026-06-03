import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchServices } from '@/data/services';
import { Service, ServiceCategory } from '@/types/service';

interface UseServicesResult {
  services: Service[];
  featuredServices: Service[];
  filteredServices: Service[];
  isLoading: boolean;
  error: string | null;
  retry: () => Promise<void>;
  activeCategory: ServiceCategory;
  setActiveCategory: (category: ServiceCategory) => void;
}

export function useServices(): UseServicesResult {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchServices();
      setServices(result);
    } catch (loadError) {
      setServices([]);
      const message =
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load services right now. Please retry.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const featuredServices = useMemo(
    () => services.filter((service) => service.isFeatured),
    [services],
  );

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') {
      return services;
    }

    return services.filter((service) => service.category === activeCategory);
  }, [activeCategory, services]);

  return {
    services,
    featuredServices,
    filteredServices,
    isLoading,
    error,
    retry: load,
    activeCategory,
    setActiveCategory,
  };
}
