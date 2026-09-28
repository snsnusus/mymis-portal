import { z } from 'zod';

export const citySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(150, 'Name must be 150 characters or fewer.'),
  psgcCode: z
    .string()
    .trim()
    .max(20, 'PSGC code must be 20 characters or fewer.'),
  regionId: z.number().int().positive('Region is required.'),
});

export type CityFormValues = z.infer<typeof citySchema>;
