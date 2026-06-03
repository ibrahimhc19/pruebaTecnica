import { useCallback, useState } from 'react';

import { submitServiceRequest } from '@/data/services';
import { ServiceRequestFormValues, ServiceRequestSuccess } from '@/types/request';

interface UseRequestServiceResult {
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: ServiceRequestSuccess | null;
  submit: (serviceId: string, values: ServiceRequestFormValues) => Promise<void>;
  clearFeedback: () => void;
}

export function useRequestService(): UseRequestServiceResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<ServiceRequestSuccess | null>(null);

  const submit = useCallback(async (serviceId: string, values: ServiceRequestFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const result = await submitServiceRequest({ serviceId, ...values });
      setSubmitSuccess(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send request. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearFeedback = useCallback(() => {
    setSubmitError(null);
    setSubmitSuccess(null);
  }, []);

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submit,
    clearFeedback,
  };
}
