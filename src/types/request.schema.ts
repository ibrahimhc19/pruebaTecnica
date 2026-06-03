import { z } from 'zod';

export const requestFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full Name must have at least 3 characters.'),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,15}$/, 'Enter a valid phone number.'),
  preferredDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use format YYYY-MM-DD.')
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Enter a valid date.',
    }),
});

export type ServiceRequestFormValues = z.infer<typeof requestFormSchema>;