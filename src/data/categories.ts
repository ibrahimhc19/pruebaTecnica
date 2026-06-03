import { ServiceCategory } from '@/types/service';

export const CATEGORY_LABELS: Record<Exclude<ServiceCategory, 'all'>, string> = {
  cleaning: 'Cleaning',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  painting: 'Painting',
  appliance: 'Appliance',
  outdoor: 'Outdoor',
};

export const CATEGORY_OPTIONS: { label: string; value: ServiceCategory }[] = [
  { label: 'All', value: 'all' },
  ...(Object.entries(CATEGORY_LABELS) as [Exclude<ServiceCategory, 'all'>, string][]).map(
    ([value, label]) => ({ label, value }),
  ),
];
