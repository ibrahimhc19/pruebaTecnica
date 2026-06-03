import { getServiceById } from '@/data/services';

export function useServiceDetail(id?: string) {
  const service = id ? getServiceById(id) : undefined;

  return {
    service,
  };
}