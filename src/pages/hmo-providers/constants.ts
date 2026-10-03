// File: src/pages/data-management/hmo/hmo.constant.ts (add below the label maps)
import {
  HMO_PLAN_TIERS,
  HMO_PREMIUM_FREQUENCIES,
  HMO_ROOM_TYPES,
  type HmoPlanTier,
  type HmoPremiumFrequency,
  type HmoRoomType,
} from '~/models/hmo.model';
import { type SelectOption } from '~/components/form/inputs/controlled/select';

export const PLAN_TIER_LABELS: Record<HmoPlanTier, string> = {
  Executive: 'Executive',
  Managerial: 'Managerial',
  RankAndFile: 'Rank and File',
};

export const ROOM_TYPE_LABELS: Record<HmoRoomType, string> = {
  OpenSuite: 'Open Suite',
  SmallSuite: 'Small Suite',
  OpenPrivate: 'Open Private',
  LargePrivate: 'Large Private',
  RegularPrivate: 'Regular Private',
  SemiPrivate: 'Semi Private',
  Ward: 'Ward',
};

export const PREMIUM_FREQUENCY_LABELS: Record<HmoPremiumFrequency, string> = {
  Monthly: 'Monthly',
  Annual: 'Annual',
};

/** Short suffix for amounts in tables, e.g. "₱18,000 /yr". */
export const PREMIUM_FREQUENCY_SUFFIX: Record<HmoPremiumFrequency, string> = {
  Monthly: '/mo',
  Annual: '/yr',
};

export const CURRENCY_SYMBOL = '₱';

export const PLAN_TIER_OPTIONS: SelectOption<HmoPlanTier>[] =
  HMO_PLAN_TIERS.map((value) => ({
    value,
    label: PLAN_TIER_LABELS[value],
  }));

export const ROOM_TYPE_OPTIONS: SelectOption<HmoRoomType>[] =
  HMO_ROOM_TYPES.map((value) => ({
    value,
    label: ROOM_TYPE_LABELS[value],
  }));

export const PREMIUM_FREQUENCY_OPTIONS: SelectOption<HmoPremiumFrequency>[] =
  HMO_PREMIUM_FREQUENCIES.map((value) => ({
    value,
    label: PREMIUM_FREQUENCY_LABELS[value],
  }));
