export interface HmoProvider {
  id: number;
  code: string;
  name: string;
  accountManagerName: string | null;
  hotline: string | null;
  supportEmail: string | null;
  websiteUrl: string | null;
  contractStartDate: string;
  contractEndDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export const HMO_PLAN_TIERS = [
  'Executive',
  'Managerial',
  'RankAndFile',
] as const;
export type HmoPlanTier = (typeof HMO_PLAN_TIERS)[number];

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

export const HMO_PREMIUM_FREQUENCIES = ['Monthly', 'Annual'] as const;
export type HmoPremiumFrequency = (typeof HMO_PREMIUM_FREQUENCIES)[number];

export interface HmoPlanCoverageItem {
  name: string;
  limitAmount: number | null;
  notes: string | null;
}

export interface HmoPlanCoverageGroup {
  category: string;
  items: HmoPlanCoverageItem[];
}

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
  pecLimit: number | null;
  dependentPremiumCost: number | null;
  dependentSubsidyPercentage: number | null;
  createdAt: string;
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

export type HmoNewPlanPayload = Omit<HmoPlanPayload, 'hmoProviderId'>;

export interface HmoProviderCreatePayload extends HmoProviderPayload {
  plans: HmoNewPlanPayload[];
}

export interface HmoProviderLookup {
  id: number;
  name: string;
}

export interface HmoPlanLookup {
  id: number;
  name: string;
  allowDependents: boolean;
}

export const HMO_DEPENDENT_RELATIONSHIPS = [
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
] as const;
export type HmoDependentRelationship =
  (typeof HMO_DEPENDENT_RELATIONSHIPS)[number];

export interface EmployeeHmoDependentPayload {
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  birthdate: string;
  relationship: HmoDependentRelationship;
  hmoPlanId: number | null;
  memberNumber: string | null;
}

export interface EmployeeHmoPayload {
  hmoPlanId: number;
  memberNumber: string;
  effectiveDate: string;
  endDate: string | null;
  dependents: EmployeeHmoDependentPayload[];
}
