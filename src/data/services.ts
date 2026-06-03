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
    name: 'House Cleaning',
    description: 'Deep or regular home cleaning by vetted professionals.',
    category: 'cleaning',
    price: 650,
    currency: 'MXN',
    rating: 4.8,
    reviewCount: 212,
    available: true,
    providerName: 'María García',
    durationMinutes: 120,
    tags: ['popular'],
  },
  {
    id: 'svc-2',
    name: 'Plumbing',
    description: 'Leak fixes, faucet replacement, and emergency plumbing.',
    category: 'plumbing',
    price: 850,
    currency: 'MXN',
    rating: 4.6,
    reviewCount: 163,
    available: true,
    providerName: 'Carlos Hernández',
    durationMinutes: 90,
    tags: [],
  },
  {
    id: 'svc-3',
    name: 'Electrical Repairs',
    description: 'Safe installation and electrical troubleshooting.',
    category: 'electrical',
    price: 950,
    currency: 'MXN',
    rating: 4.7,
    reviewCount: 189,
    available: false,
    unavailableReason: 'Currently unavailable in your area.',
    providerName: 'Roberto Díaz',
    durationMinutes: 75,
    tags: ['popular'],
  },
  {
    id: 'svc-4',
    name: 'Painting',
    description: 'Interior and exterior painting with material options.',
    category: 'painting',
    price: 1200,
    currency: 'MXN',
    rating: 4.5,
    reviewCount: 121,
    available: true,
    providerName: 'Ana Martínez',
    durationMinutes: 180,
    tags: [],
  },
  {
    id: 'svc-5',
    name: 'Appliance Repair',
    description: 'Diagnosis and repairs for essential household appliances.',
    category: 'appliance',
    price: 900,
    currency: 'MXN',
    rating: 4.4,
    reviewCount: 98,
    available: true,
    providerName: 'Luis Ramírez',
    durationMinutes: 60,
    tags: ['popular'],
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
