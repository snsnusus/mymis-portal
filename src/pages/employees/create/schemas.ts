import type { Barangay } from '~/models/barangay.model';
import type { City } from '~/models/city.model';
import type { Region } from '~/models/region.model';

import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const ADDRESS_SCHEMA = z.object({
  addressLine1: z.string().trim().min(1, 'Address line 1 is required.'),
  addressLine2: z.string().trim().optional(),
  region: z.custom<Region>((value) => value != null, 'Region is required.'),
  city: z.custom<City>((value) => value != null, 'City is required.'),
  barangay: z.custom<Barangay>(
    (value) => value != null,
    'Barangay is required.'
  ),
  postalCode: z.string().trim().min(1, 'Postal code is required.'),
});

export const EMAIL_SCHEMA = z.email('Please enter a valid email address.');

export const PHONE_NUMBER_SCHEMA = z
  .string()
  .refine((value) => isValidPhoneNumber(value, 'PH'), {
    message: 'Please enter a valid Philippine phone number.',
  });
