import { z } from 'zod';
import {
  MEMBER_ROLE_OPTIONS,
  ROOM_BOARD_OPTIONS,
  TIER_OPTIONS,
} from './constants';

export const hmoPlanSchema = z
  .object({
    id: z.string(),
    memberRole: z.enum(MEMBER_ROLE_OPTIONS),
    planName: z.string().min(1, 'Plan name is required.'),
    tier: z.enum(TIER_OPTIONS),
    mblAmount: z.number().positive('MBL amount must be greater than 0.'),
    roomType: z.enum(ROOM_BOARD_OPTIONS),
    premiumCost: z.number().positive('Premium cost must be greater than 0.'),
    employerSubsidyPercentage: z
      .number()
      .min(0)
      .max(100, 'Subsidy cannot exceed 100%.'),
    pecCovered: z.boolean(),
    pecLimit: z.number().positive().optional(),
    hasDental: z.boolean(),
    hasApe: z.boolean(),
    planWebsiteUrl: z.string(),
    duplicateEnabled: z.boolean(),
  })
  .refine(
    (data) =>
      !data.pecCovered || (data.pecCovered && data.pecLimit !== undefined),
    {
      message: 'PEC limit is required when PEC is covered.',
      path: ['pecLimit'],
    }
  );

export const hmoProviderSchema = z
  .object({
    id: z.string(),
    code: z.string().min(1, 'Provider code is required.'),
    name: z.string().min(1, 'Provider name is required.'),
    logoUrl: z.url('Enter a valid URL.').or(z.literal('')),
    status: z.enum(['Active', 'Inactive']),
    accountManagerName: z.string().min(1, 'Account manager name is required.'),
    hotline: z.string().min(1, 'Hotline is required.'),
    supportEmail: z.email('Enter a valid email address.'),
    websiteUrl: z.url('Enter a valid URL.').or(z.literal('')),
    contractStartDate: z.string().min(1, 'Start date is required.'),
    contractEndDate: z.string().min(1, 'End date is required.'),
    plans: z.array(hmoPlanSchema),
  })
  .refine(
    (data) => new Date(data.contractEndDate) > new Date(data.contractStartDate),
    {
      message: 'Contract end date must be after the start date.',
      path: ['contractEndDate'],
    }
  );

export type HMOPlanFormValues = z.infer<typeof hmoPlanSchema>;
export type HMOProviderFormValues = z.infer<typeof hmoProviderSchema>;
