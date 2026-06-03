import { ServiceCategory } from '@/types/service';

export const CATEGORY_OPTIONS: { label: string; value: ServiceCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Cleaning', value: 'cleaning' },
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Painting', value: 'painting' },
  { label: 'Appliance', value: 'appliance' },
  { label: 'Outdoor', value: 'outdoor' },
];