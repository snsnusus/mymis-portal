import { z } from 'zod';

export const barangaySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(150, 'Name must be 150 characters or fewer.'),
  psgcCode: z
    .string()
    .trim()
    .max(20, 'PSGC code must be 20 characters or fewer.'),
  zipCode: z
    .string()
    .trim()
    .max(10, 'ZIP code must be 10 characters or fewer.'),
  cityId: z.number().int().positive('City is required.'),
});

export type BarangayFormValues = z.infer<typeof barangaySchema>;
