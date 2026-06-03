import { useMemo } from 'react';

import { getServiceById } from '@/data/services';

export function useServiceDetail(id?: string) {
  const service = useMemo(() => getServiceById(id), [id]);

  return {
    service,
  };
}