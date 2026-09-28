import type { Region, City, Barangay } from './location.model';

export type BaseAddress = {
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  tag: string;
  isPrimary: boolean;
};

export type AddressFormValues = BaseAddress & {
  region: Region | null;
  city: City | null;
  barangay: Barangay | null;
};

export type AddressPayload = BaseAddress & {
  userId: string;
  regionId: string;
  cityId: string;
  barangayId: string;
  formattedAddress: string;
};

export type AddressModel = BaseAddress &
  AddressPayload & {
    id: string;
  };

export type Address = AddressFormValues & {
  id: string;
};
