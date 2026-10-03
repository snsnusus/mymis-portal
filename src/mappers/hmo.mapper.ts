import { fractionToPercent, percentToFraction } from '~/utils/number.util';

import type {
  HmoProvider,
  HmoPlan,
  HmoPlanPayload,
  HmoPlanTier,
  HmoPremiumFrequency,
  HmoRoomType,
  HmoProviderPayload,
  HmoProviderCreatePayload,
  HmoNewPlanPayload,
} from '~/models/hmo.model';
import type {
  HmoPlanFormValues,
  HmoProviderCreateFormValues,
  HmoProviderFormValues,
} from '~/schema/hmo.schema';

export const hmoProviderPayloadToFormValuesMapper = (
  provider: HmoProvider
): HmoProviderFormValues => ({
  code: provider.code,
  name: provider.name,
  accountManagerName: provider.accountManagerName ?? '',
  hotline: provider.hotline ?? '',
  supportEmail: provider.supportEmail ?? '',
  websiteUrl: provider.websiteUrl ?? '',
  contractStartDate: provider.contractStartDate,
  contractEndDate: provider.contractEndDate,
  isActive: provider.isActive,
});

export const hmoProviderFormValuesToPayloadMapper = (
  values: HmoProviderFormValues
): HmoProviderPayload => ({
  code: values.code,
  name: values.name,
  accountManagerName: values.accountManagerName || null,
  hotline: values.hotline || null,
  supportEmail: values.supportEmail || null,
  websiteUrl: values.websiteUrl || null,
  contractStartDate: values.contractStartDate,
  contractEndDate: values.contractEndDate,
  isActive: values.isActive,
});

export const hmoPlanApiToFormValuesMapper = (
  plan: HmoPlan
): HmoPlanFormValues => ({
  name: plan.name,
  tier: plan.tier,
  roomType: plan.roomType,
  maximumBenefitLimit: plan.maximumBenefitLimit,
  premiumFrequency: plan.premiumFrequency,
  premiumCost: plan.premiumCost,
  employerSubsidyPercentage: percentToFraction(plan.employerSubsidyPercentage),
  pecCovered: plan.pecCovered,
  pecLimit: plan.pecLimit,
  allowDependents: plan.allowDependents,
  dependentPremiumCost: plan.dependentPremiumCost,
  dependentSubsidyPercentage:
    plan.dependentSubsidyPercentage === null
      ? null
      : percentToFraction(plan.dependentSubsidyPercentage),
  isActive: plan.isActive,
  coverageGroups: plan.coverageGroups.map((group) => ({
    category: group.category,
    items: group.items.map((item) => ({
      name: item.name,
      limitAmount: item.limitAmount,
      notes: item.notes ?? '',
    })),
  })),
});

export const hmoPlanFormValuesToNewPlanPayloadMapper = (
  values: HmoPlanFormValues
): HmoNewPlanPayload => ({
  name: values.name,
  tier: values.tier as HmoPlanTier,
  roomType: values.roomType as HmoRoomType,
  maximumBenefitLimit: values.maximumBenefitLimit as number,
  premiumFrequency: values.premiumFrequency as HmoPremiumFrequency,
  premiumCost: values.premiumCost as number,
  employerSubsidyPercentage: fractionToPercent(
    values.employerSubsidyPercentage as number
  ),
  pecCovered: values.pecCovered,
  pecLimit: values.pecCovered ? values.pecLimit : null,
  allowDependents: values.allowDependents,
  dependentPremiumCost: values.allowDependents
    ? values.dependentPremiumCost
    : null,
  dependentSubsidyPercentage:
    values.allowDependents && values.dependentSubsidyPercentage !== null
      ? fractionToPercent(values.dependentSubsidyPercentage)
      : null,
  isActive: values.isActive,
  coverageGroups: values.coverageGroups.map((group) => ({
    category: group.category,
    items: group.items.map((item) => ({
      name: item.name,
      limitAmount: item.limitAmount,
      notes: item.notes || null,
    })),
  })),
});

export const hmoPlanFormValuesToPayloadMapper = (
  values: HmoPlanFormValues,
  hmoProviderId: number
): HmoPlanPayload => ({
  hmoProviderId,
  ...hmoPlanFormValuesToNewPlanPayloadMapper(values),
});

export const hmoProviderCreateFormValuesToPayloadMapper = (
  values: HmoProviderCreateFormValues
): HmoProviderCreatePayload => ({
  ...hmoProviderFormValuesToPayloadMapper(values),
  plans: values.plans.map(hmoPlanFormValuesToNewPlanPayloadMapper),
});
