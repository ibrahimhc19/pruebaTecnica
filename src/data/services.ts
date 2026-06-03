import { Service } from '@/types/service';
import { ServiceRequestPayload, ServiceRequestSuccess } from '@/types/request';

const NETWORK_DELAY_MS = 1500;
const LOAD_ERROR_RATE = 0.25;
const SUBMIT_ERROR_RATE = 0.3;

function shouldFail(rate: number): boolean {
  return Math.random() < rate;
}

async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export const servicesMock: Service[] = [
  {
    id: 'svc-1',
    title: 'House Cleaning',
    description: 'Deep or regular home cleaning by vetted professionals.',
    category: 'cleaning',
    basePrice: 60,
    estimatedDurationMinutes: 120,
    providerRating: 4.8,
    reviewCount: 212,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: 'svc-2',
    title: 'Plumbing',
    description: 'Leak fixes, faucet replacement, and emergency plumbing.',
    category: 'plumbing',
    basePrice: 85,
    estimatedDurationMinutes: 90,
    providerRating: 4.6,
    reviewCount: 163,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 'svc-3',
    title: 'Electrical Repairs',
    description: 'Safe installation and electrical troubleshooting.',
    category: 'electrical',
    basePrice: 95,
    estimatedDurationMinutes: 75,
    providerRating: 4.7,
    reviewCount: 189,
    isAvailable: false,
    unavailableReason: 'Currently unavailable in your area.',
    isFeatured: true,
  },
  {
    id: 'svc-4',
    title: 'Painting',
    description: 'Interior and exterior painting with material options.',
    category: 'painting',
    basePrice: 120,
    estimatedDurationMinutes: 180,
    providerRating: 4.5,
    reviewCount: 121,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: 'svc-5',
    title: 'Appliance Repair',
    description: 'Diagnosis and repairs for essential household appliances.',
    category: 'appliance',
    basePrice: 90,
    estimatedDurationMinutes: 60,
    providerRating: 4.4,
    reviewCount: 98,
    isAvailable: true,
    isFeatured: true,
  },
];

export async function fetchServices(): Promise<Service[]> {
  await wait(NETWORK_DELAY_MS);

  if (shouldFail(LOAD_ERROR_RATE)) {
    throw new Error('Unable to load services right now. Please retry.');
  }

  return servicesMock;
}

export function getServiceById(id: string | undefined): Service | undefined {
  if (!id) {
    return undefined;
  }

  return servicesMock.find((service) => service.id === id);
}

export async function submitServiceRequest(
  payload: ServiceRequestPayload,
): Promise<ServiceRequestSuccess> {
  await wait(NETWORK_DELAY_MS);

  if (shouldFail(SUBMIT_ERROR_RATE)) {
    throw new Error('We could not submit your request. Please try again.');
  }

  return {
    requestId: `req-${Date.now()}`,
    message: `Request sent for ${payload.fullName}. We will contact you shortly.`,
  };
}
