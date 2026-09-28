import { z } from 'zod';

export const regionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(150, 'Name must be 150 characters or fewer.'),
  psgcCode: z
    .string()
    .trim()
    .max(20, 'PSGC code must be 20 characters or fewer.'),
});

export type RegionFormValues = z.infer<typeof regionSchema>;
