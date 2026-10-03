/** Response from GET /api/HmoProviders and GET /api/HmoProviders/{id}. */
export interface HmoProvider {
  id: number;
  code: string;
  name: string;
  accountManagerName: string | null;
  hotline: string | null;
  supportEmail: string | null;
  websiteUrl: string | null;
  /** Calendar date as sent by the API: 'YYYY-MM-DD'. */
  contractStartDate: string;
  /** Calendar date as sent by the API: 'YYYY-MM-DD'. */
  contractEndDate: string;
  isActive: boolean;
  /** UTC timestamp, ISO 8601 (ends in 'Z'). */
  createdAt: string;
  /** UTC timestamp, ISO 8601 (ends in 'Z'). */
  updatedAt: string;
}

/** Body for POST /api/HmoProviders and PUT /api/HmoProviders/{id}. */
export interface HmoProviderPayload {
  code: string;
  name: string;
  accountManagerName: string | null;
  hotline: string | null;
  supportEmail: string | null;
  websiteUrl: string | null;
  contractStartDate: string;
  contractEndDate: string;
  isActive: boolean;
}

/** API values for HmoPlanTier. Display labels live in the HMO constants file. */
export const HMO_PLAN_TIERS = [
  'Executive',
  'Managerial',
  'RankAndFile',
] as const;
export type HmoPlanTier = (typeof HMO_PLAN_TIERS)[number];

/** API values for HmoRoomType, best to worst (same order as the C# enum). */
export const HMO_ROOM_TYPES = [
  'OpenSuite',
  'SmallSuite',
  'OpenPrivate',
  'LargePrivate',
  'RegularPrivate',
  'SemiPrivate',
  'Ward',
] as const;
export type HmoRoomType = (typeof HMO_ROOM_TYPES)[number];

/** API values for HmoPremiumFrequency. */
export const HMO_PREMIUM_FREQUENCIES = ['Monthly', 'Annual'] as const;
export type HmoPremiumFrequency = (typeof HMO_PREMIUM_FREQUENCIES)[number];

/** One coverage line. Same shape in requests and responses. */
export interface HmoPlanCoverageItem {
  name: string;
  /** Peso cap, if the item has one. */
  limitAmount: number | null;
  notes: string | null;
}

/** One category heading with its items. Same shape in requests and responses. */
export interface HmoPlanCoverageGroup {
  category: string;
  items: HmoPlanCoverageItem[];
}

/** Row from GET /api/HmoPlans?providerId= (no coverage). */
export interface HmoPlanSummary {
  id: number;
  hmoProviderId: number;
  name: string;
  tier: HmoPlanTier;
  roomType: HmoRoomType;
  maximumBenefitLimit: number;
  premiumFrequency: HmoPremiumFrequency;
  premiumCost: number;
  allowDependents: boolean;
  isActive: boolean;
}

export interface HmoPlan extends HmoPlanSummary {
  hmoProviderName: string;
  employerSubsidyPercentage: number;
  pecCovered: boolean;
  /** null when pecCovered is false. */
  pecLimit: number | null;
  /** null when allowDependents is false. */
  dependentPremiumCost: number | null;
  /** null when allowDependents is false. */
  dependentSubsidyPercentage: number | null;
  /** UTC timestamp, ISO 8601. */
  createdAt: string;
  /** UTC timestamp, ISO 8601. */
  updatedAt: string;
  coverageGroups: HmoPlanCoverageGroup[];
}

export interface HmoPlanPayload {
  hmoProviderId: number;
  name: string;
  tier: HmoPlanTier;
  roomType: HmoRoomType;
  maximumBenefitLimit: number;
  premiumFrequency: HmoPremiumFrequency;
  premiumCost: number;
  employerSubsidyPercentage: number;
  pecCovered: boolean;
  pecLimit: number | null;
  allowDependents: boolean;
  dependentPremiumCost: number | null;
  dependentSubsidyPercentage: number | null;
  isActive: boolean;
  coverageGroups: HmoPlanCoverageGroup[];
}

/** A plan inside a provider-create request: the provider doesn't exist yet, so no hmoProviderId. */
export type HmoNewPlanPayload = Omit<HmoPlanPayload, 'hmoProviderId'>;

/** Body for POST /api/HmoProviders: the provider plus its initial plans. */
export interface HmoProviderCreatePayload extends HmoProviderPayload {
  plans: HmoNewPlanPayload[];
}
