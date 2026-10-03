const HMO_BASE = '/data-management/hmo-providers';

export const HMO_PATHS = {
  providers: HMO_BASE,
  provider: (providerId: number) => `${HMO_BASE}/${providerId}`,
  newPlan: (providerId: number) => `${HMO_BASE}/${providerId}/plans/new`,
  editPlan: (providerId: number, planId: number) =>
    `${HMO_BASE}/${providerId}/plans/${planId}/edit`,
  createProvider: `${HMO_BASE}/create-provider`,
};
