import { type ComponentType } from 'react';
import { type FieldPath } from 'react-hook-form';
import type { Barangay } from '~/models/barangay.model';
import type { City } from '~/models/city.model';
import type { Region } from '~/models/region.model';
import type {
  AddressType,
  ContactOwnership,
  EmployeeType,
  EmergencyContactRelationship,
  EmploymentStatus,
} from '~/models/employee.model';
import type { HmoDependentRelationship } from '~/models/hmo.model';

export type HmoDependentValues = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthdate: string;
  relationship: HmoDependentRelationship | '';
  hmoPlanId: number | null;
  memberNumber: string;
};

export type HmoValues = {
  isEnrolled: boolean;
  hmoProviderId: number | null;
  hmoPlanId: number | null;
  memberNumber: string;
  effectiveDate: string;
  endDate: string;
  dependents: HmoDependentValues[];
};

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  region: Region | null;
  city: City | null;
  barangay: Barangay | null;
  postalCode: string;
  formattedAddress: string;
}

export interface Phone {
  countryCode: string;
  dialCode: string;
  international: string;
  local: string;
  formatted: string;
}

/** An employee address entry: the shared address fields plus its type. */
export type EmployeeAddressValues = Address & { type: AddressType };

/** An employee phone entry: the shared phone fields plus who owns it. */
export type EmployeePhoneValues = Phone & { ownership: ContactOwnership };

/** An employee email entry. */
export type EmployeeEmailValues = {
  value: string;
  ownership: ContactOwnership;
};

export type PasswordMode = 'free-text' | 'default' | 'random';

export interface EmployeeCreateFormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  gender: string;
  maritalStatus: string;
  birthdate: string;
  birthplace?: string;
  nationality?: string;
  avatar: File | null;
  addresses: EmployeeAddressValues[];
  phones: EmployeePhoneValues[];
  emails: EmployeeEmailValues[];
  emergencyContact: {
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    relationship: EmergencyContactRelationship | '';
    contactNumber: Phone;
    address: Address;
  };
  employeeType: EmployeeType | '';
  employmentStatus: EmploymentStatus | '';
  departmentId: number | null;
  positionId: number | null;
  joiningDate: Date | null;
  hmo: HmoValues;
  ssNumber: string;
  philHealthNumber: string;
  pagIbigNumber: string;
  tinNumber: string;
  username: string;
  password: string;
  passwordMode: PasswordMode;
}

export type WizardStep = {
  label: string;
  component: ComponentType;
  fields: FieldPath<EmployeeCreateFormValues>[];
};
