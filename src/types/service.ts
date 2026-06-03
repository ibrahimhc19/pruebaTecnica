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
  name: string;
  category: Exclude<ServiceCategory, 'all'>;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  unavailableReason?: string;
  providerName: string;
  durationMinutes: number;
  tags: string[];
}
