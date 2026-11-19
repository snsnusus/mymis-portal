import { type ComponentType } from 'react';
import { type FieldPath } from 'react-hook-form';
import type { Barangay } from '~/models/barangay.model';
import type { City } from '~/models/city.model';
import type { Region } from '~/models/region.model';
import type {
  AvatarStyle,
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
  avatarStyle: AvatarStyle | null;
  addresses: Address[];
  phones: Phone[];
  emails: Array<{ value: string }>;
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
  username: string;
  password: string;
  passwordMode: PasswordMode;
}

export type WizardStep = {
  label: string;
  component: ComponentType;
  fields: FieldPath<EmployeeCreateFormValues>[];
};
