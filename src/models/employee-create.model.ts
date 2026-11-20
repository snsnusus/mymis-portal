import type {
  AddressType,
  ContactOwnership,
  EmergencyContactRelationship,
  EmployeeType,
  EmploymentStatus,
} from '~/models/employee.model';
import type { HmoDependentRelationship } from '~/models/hmo.model';

export type PhonePayload = {
  countryCode: string;
  number: string;
};

export type AddressPayload = {
  addressLine1: string;
  addressLine2: string | null;
  barangayId: number;
  postalCode: string;
};

export type EmployeeAddressPayload = {
  type: AddressType;
  address: AddressPayload;
  isPrimary: boolean;
};

export type EmployeePhonePayload = {
  ownership: ContactOwnership;
  phone: PhonePayload;
  isPrimary: boolean;
};

export type EmployeeEmailPayload = {
  ownership: ContactOwnership;
  email: string;
  isPrimary: boolean;
};

export type EmergencyContactPayload = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  relationship: EmergencyContactRelationship;
  phone: PhonePayload;
  address: AddressPayload;
  isPrimary: boolean;
};

export type EmployeeHmoDependentPayload = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  /** 'YYYY-MM-DD' */
  birthdate: string;
  relationship: HmoDependentRelationship;
  /** null means "same plan as the employee". */
  hmoPlanId: number | null;
  memberNumber: string | null;
};

export type EmployeeHmoPayload = {
  hmoPlanId: number;
  memberNumber: string;
  /** 'YYYY-MM-DD' */
  effectiveDate: string;
  /** 'YYYY-MM-DD', or null for no end date. */
  endDate: string | null;
  dependents: EmployeeHmoDependentPayload[];
};

export type GovernmentIdsPayload = {
  sssNumber: string | null;
  philHealthNumber: string | null;
  pagIbigNumber: string | null;
  tinNumber: string | null;
};

/** Body of POST /api/Employees, matching the API's EmployeeCreateDto. */
export type EmployeeCreatePayload = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string | null;
  gender: string;
  /** 'YYYY-MM-DD', or null when not set. */
  birthdate: string | null;
  maritalStatus: string;
  employeeType: EmployeeType;
  employmentStatus: EmploymentStatus;
  /** 'YYYY-MM-DD' */
  joiningDate: string;
  departmentId: number | null;
  positionId: number | null;
  username: string;
  password: string;
  personalDetail: {
    birthplace: string | null;
    nationality: string | null;
  };
  emergencyContact: EmergencyContactPayload;
  addresses: EmployeeAddressPayload[];
  phones: EmployeePhonePayload[];
  emails: EmployeeEmailPayload[];
  /** Left out when the employee isn't enrolled. */
  hmo?: EmployeeHmoPayload;
  /** Left out when every number is blank. */
  governmentIds?: GovernmentIdsPayload;
};
