export type ServiceCategory =
  | 'all'
  | 'cleaning'
  | 'plumbing'
  | 'electrical'
  | 'painting'
  | 'appliance'
  | 'outdoor';

export interface Service {
  id: string;
  title: string;
  description: string;
  category: Exclude<ServiceCategory, 'all'>;
  basePrice: number;
  estimatedDurationMinutes: number;
  providerRating: number;
  reviewCount: number;
  isAvailable: boolean;
  unavailableReason?: string;
  isFeatured: boolean;
}
