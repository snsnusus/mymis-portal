import type {
  Address,
  EmployeeCreateFormValues,
  HmoDependentValues,
  HmoValues,
  Phone,
} from '../types';

export const EMPTY_ADDRESS: Address = {
  addressLine1: '',
  addressLine2: '',
  region: null,
  city: null,
  barangay: null,
  postalCode: '',
  formattedAddress: '',
};

export const EMPTY_PHONE: Phone = {
  countryCode: '',
  dialCode: '',
  international: '',
  local: '',
  formatted: '',
};

export const EMPTY_HMO_DEPENDENT: HmoDependentValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  birthdate: '',
  relationship: '',
  hmoPlanId: null,
  memberNumber: '',
};

export const EMPTY_HMO: HmoValues = {
  isEnrolled: false,
  hmoProviderId: null,
  hmoPlanId: null,
  memberNumber: '',
  effectiveDate: '',
  endDate: '',
  dependents: [],
};

export const DEFAULT_VALUES: EmployeeCreateFormValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  gender: '',
  maritalStatus: '',
  birthdate: null,
  birthplace: '',
  nationality: '',
  avatar: null,
  avatarStyle: null,
  addresses: [],
  phones: [],
  emails: [],
  emergencyContact: {
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    relationship: '',
    contactNumber: EMPTY_PHONE,
    address: EMPTY_ADDRESS,
  },
  employeeType: '',
  departmentId: null,
  positionId: null,
  employmentStatus: '',
  joiningDate: null,
  hmo: EMPTY_HMO,
  username: '',
  password: '',
};
