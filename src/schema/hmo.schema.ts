import { z } from 'zod';

import {
  HMO_PLAN_TIERS,
  HMO_PREMIUM_FREQUENCIES,
  HMO_ROOM_TYPES,
} from '~/models/hmo.model';

const hmoProviderFields = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Provider code is required.')
    .max(20, 'Code must be 20 characters or fewer.'),
  name: z
    .string()
    .trim()
    .min(1, 'Provider name is required.')
    .max(150, 'Name must be 150 characters or fewer.'),
  accountManagerName: z
    .string()
    .trim()
    .max(150, 'Account manager name must be 150 characters or fewer.'),
  hotline: z.string().trim().max(50, 'Hotline must be 50 characters or fewer.'),
  supportEmail: z.union([
    z.literal(''),
    z
      .email('Enter a valid email address.')
      .max(254, 'Email must be 254 characters or fewer.'),
  ]),
  websiteUrl: z.union([
    z.literal(''),
    z
      .url({
        protocol: /^https?$/,
        error: 'Enter a full URL starting with http:// or https://.',
      })
      .max(500, 'URL must be 500 characters or fewer.'),
  ]),
  contractStartDate: z.string().min(1, 'Start date is required.'),
  contractEndDate: z.string().min(1, 'End date is required.'),
  isActive: z.boolean(),
});

const contractDatesInOrder = (data: {
  contractStartDate: string;
  contractEndDate: string;
}): boolean =>
  !data.contractStartDate ||
  !data.contractEndDate ||
  data.contractEndDate > data.contractStartDate;

const CONTRACT_DATES_ERROR = {
  message: 'Contract end date must be after the start date.',
  path: ['contractEndDate'],
};

/** Edit dialog: provider fields only. */
export const hmoProviderSchema = hmoProviderFields.refine(
  contractDatesInOrder,
  CONTRACT_DATES_ERROR
);

export type HmoProviderFormValues = z.infer<typeof hmoProviderSchema>;

export const emptyHmoProviderFormValues = (): HmoProviderFormValues => ({
  code: '',
  name: '',
  accountManagerName: '',
  hotline: '',
  supportEmail: '',
  websiteUrl: '',
  contractStartDate: '',
  contractEndDate: '',
  isActive: true,
});

const MAX_AMOUNT = 9_999_999_999.99;

const amount = (label: string, required: boolean): z.ZodNullable<z.ZodNumber> =>
  z
    .number({ error: `${label} must be a number.` })
    .positive(`${label} must be greater than 0.`)
    .max(MAX_AMOUNT, `${label} is too large.`)
    .nullable()
    .refine((value) => !required || value !== null, `${label} is required.`);

const percentage = (label: string, required: boolean) =>
  z
    .number({ error: `${label} must be a number.` })
    .min(0, `${label} cannot be negative.`)
    .max(1, `${label} cannot exceed 100%.`)
    .nullable()
    .refine((value) => !required || value !== null, `${label} is required.`);

const coverageItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Item name is required.')
    .max(300, 'Item name must be 300 characters or fewer.'),
  limitAmount: amount('Limit', false),
  notes: z.string().trim().max(500, 'Notes must be 500 characters or fewer.'),
});

const coverageGroupSchema = z.object({
  category: z
    .string()
    .trim()
    .min(1, 'Category is required.')
    .max(100, 'Category must be 100 characters or fewer.'),
  items: z.array(coverageItemSchema).min(1, 'Add at least one item.'),
});

export const hmoPlanSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Plan name is required.')
      .max(150, 'Plan name must be 150 characters or fewer.'),
    tier: z
      .enum(HMO_PLAN_TIERS, { error: 'Select a tier.' })
      .nullable()
      .refine((value): boolean => value !== null, 'Select a tier.'),
    roomType: z
      .enum(HMO_ROOM_TYPES, { error: 'Select a room type.' })
      .nullable()
      .refine((value): boolean => value !== null, 'Select a room type.'),
    maximumBenefitLimit: amount('Maximum benefit limit', true),
    premiumFrequency: z
      .enum(HMO_PREMIUM_FREQUENCIES, { error: 'Select a premium frequency.' })
      .nullable()
      .refine(
        (value): boolean => value !== null,
        'Select a premium frequency.'
      ),
    premiumCost: amount('Premium cost', true),
    employerSubsidyPercentage: percentage('Employer subsidy', true),
    pecCovered: z.boolean(),
    pecLimit: amount('PEC limit', false),
    allowDependents: z.boolean(),
    dependentPremiumCost: amount('Dependent premium cost', false),
    dependentSubsidyPercentage: percentage('Dependent subsidy', false),
    isActive: z.boolean(),
    coverageGroups: z.array(coverageGroupSchema),
  })
  .superRefine((data, ctx) => {
    if (data.pecCovered && data.pecLimit === null) {
      ctx.addIssue({
        code: 'custom',
        message: 'PEC limit is required when PEC is covered.',
        path: ['pecLimit'],
      });
    }

    if (
      data.pecCovered &&
      data.pecLimit !== null &&
      data.maximumBenefitLimit !== null &&
      data.pecLimit > data.maximumBenefitLimit
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'PEC limit cannot exceed the maximum benefit limit.',
        path: ['pecLimit'],
      });
    }

    if (data.allowDependents && data.dependentPremiumCost === null) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Dependent premium cost is required when dependents are allowed.',
        path: ['dependentPremiumCost'],
      });
    }

    if (data.allowDependents && data.dependentSubsidyPercentage === null) {
      ctx.addIssue({
        code: 'custom',
        message: 'Dependent subsidy is required when dependents are allowed.',
        path: ['dependentSubsidyPercentage'],
      });
    }

    const seenCategories = new Set<string>();
    data.coverageGroups.forEach((group, index) => {
      const key = group.category.trim().toLowerCase();
      if (key === '') {
        return;
      }
      if (seenCategories.has(key)) {
        ctx.addIssue({
          code: 'custom',
          message: 'This category is already used above.',
          path: ['coverageGroups', index, 'category'],
        });
      } else {
        seenCategories.add(key);
      }
    });
  });

export type HmoPlanFormValues = z.infer<typeof hmoPlanSchema>;
export type HmoPlanCoverageGroupFormValues =
  HmoPlanFormValues['coverageGroups'][number];
export type HmoPlanCoverageItemFormValues =
  HmoPlanCoverageGroupFormValues['items'][number];

export const emptyCoverageItem = (): HmoPlanCoverageItemFormValues => ({
  name: '',
  limitAmount: null,
  notes: '',
});

export const emptyCoverageGroup = (): HmoPlanCoverageGroupFormValues => ({
  category: '',
  items: [emptyCoverageItem()],
});

export const emptyHmoPlanFormValues = (): HmoPlanFormValues => ({
  name: '',
  tier: null,
  roomType: null,
  maximumBenefitLimit: null,
  premiumFrequency: 'Annual',
  premiumCost: null,
  employerSubsidyPercentage: null,
  pecCovered: false,
  pecLimit: null,
  allowDependents: false,
  dependentPremiumCost: null,
  dependentSubsidyPercentage: null,
  isActive: true,
  coverageGroups: [],
});

export const hmoProviderCreateSchema = hmoProviderFields
  .extend({ plans: z.array(hmoPlanSchema) })
  .refine(contractDatesInOrder, CONTRACT_DATES_ERROR)
  .superRefine((data, ctx) => {
    const seenNames = new Set<string>();
    data.plans.forEach((plan, index) => {
      const key = plan.name.trim().toLowerCase();
      if (key === '') {
        return;
      }
      if (seenNames.has(key)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Another plan already uses this name.',
          path: ['plans', index, 'name'],
        });
      } else {
        seenNames.add(key);
      }
    });
  });

export type HmoProviderCreateFormValues = z.infer<
  typeof hmoProviderCreateSchema
>;

export const emptyHmoProviderCreateFormValues =
  (): HmoProviderCreateFormValues => ({
    ...emptyHmoProviderFormValues(),
    plans: [],
  });
