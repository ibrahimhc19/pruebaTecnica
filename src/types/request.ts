import type { ServiceRequestFormValues } from '@/types/request.schema';

export type { ServiceRequestFormValues };

export interface ServiceRequestPayload extends ServiceRequestFormValues {
  serviceId: string;
}

export interface ServiceRequestSuccess {
  requestId: string;
  message: string;
}
