export interface ServiceRequestFormValues {
  fullName: string;
  phoneNumber: string;
  preferredDate: string;
}

export interface ServiceRequestPayload extends ServiceRequestFormValues {
  serviceId: string;
}

export interface ServiceRequestSuccess {
  requestId: string;
  message: string;
}
