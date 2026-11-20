import type {
  AddressPayload,
  EmployeeCreatePayload,
  EmployeeHmoPayload,
  GovernmentIdsPayload,
  PhonePayload,
} from '~/models/employee-create.model';
import type {
  Address,
  EmployeeCreateFormValues,
  HmoValues,
  Phone,
} from '../types';
import { dateToDateOnly } from '~/utils/date.util';

/** Trims a string and turns '' (or a missing value) into null. */
const nullIfBlank = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim() ?? '';
  return trimmed === '' ? null : trimmed;
};

/**
 * Returns a value the form's validation guarantees is set, or throws if it isn't.
 * Narrows away the form's "nothing picked yet" values ('' and null).
 */
const requireValue = <T>(
  value: T | '' | null | undefined,
  field: string
): T => {
  if (value === '' || value === null || value === undefined) {
    throw new Error(`${field} must be set before the payload is built.`);
  }
  return value;
};

const toPhone = (phone: Phone): PhonePayload => ({
  countryCode: phone.countryCode,
  number: phone.international,
});

const toAddress = (address: Address, field: string): AddressPayload => ({
  addressLine1: address.addressLine1.trim(),
  addressLine2: nullIfBlank(address.addressLine2),
  barangayId: requireValue(address.barangay, `${field} barangay`).id,
  postalCode: address.postalCode.trim(),
});

const toHmo = (hmo: HmoValues): EmployeeHmoPayload | undefined => {
  if (!hmo.isEnrolled) return undefined;

  return {
    hmoPlanId: requireValue(hmo.hmoPlanId, 'HMO plan'),
    memberNumber: hmo.memberNumber.trim(),
    effectiveDate: requireValue(hmo.effectiveDate, 'HMO effective date'),
    endDate: nullIfBlank(hmo.endDate),
    dependents: hmo.dependents.map((dependent, index) => ({
      firstName: dependent.firstName.trim(),
      middleName: nullIfBlank(dependent.middleName),
      lastName: dependent.lastName.trim(),
      suffix: nullIfBlank(dependent.suffix),
      birthdate: requireValue(
        dependent.birthdate,
        `Dependent ${index + 1} birthdate`
      ),
      relationship: requireValue(
        dependent.relationship,
        `Dependent ${index + 1} relationship`
      ),
      hmoPlanId: dependent.hmoPlanId,
      memberNumber: nullIfBlank(dependent.memberNumber),
    })),
  };
};

const toGovernmentIds = (
  values: EmployeeCreateFormValues
): GovernmentIdsPayload | undefined => {
  const ids: GovernmentIdsPayload = {
    sssNumber: nullIfBlank(values.ssNumber),
    philHealthNumber: nullIfBlank(values.philHealthNumber),
    pagIbigNumber: nullIfBlank(values.pagIbigNumber),
    tinNumber: nullIfBlank(values.tinNumber),
  };

  return Object.values(ids).some((id) => id !== null) ? ids : undefined;
};

/** Builds the POST /api/Employees body from validated wizard values. */
export const toEmployeeCreatePayload = (
  values: EmployeeCreateFormValues
): EmployeeCreatePayload => {
  const contact = values.emergencyContact;

  return {
    firstName: values.firstName.trim(),
    middleName: values.middleName.trim(),
    lastName: values.lastName.trim(),
    suffix: nullIfBlank(values.suffix),
    gender: values.gender,
    birthdate: nullIfBlank(values.birthdate),
    maritalStatus: values.maritalStatus,
    employeeType: requireValue(values.employeeType, 'Employee type'),
    employmentStatus: requireValue(
      values.employmentStatus,
      'Employment status'
    ),
    joiningDate: requireValue(
      dateToDateOnly(values.joiningDate),
      'Joining date'
    ),
    departmentId: values.departmentId,
    positionId: values.positionId,
    username: values.username,
    password: values.password,
    personalDetail: {
      birthplace: nullIfBlank(values.birthplace),
      nationality: nullIfBlank(values.nationality),
    },
    emergencyContact: {
      firstName: contact.firstName.trim(),
      middleName: nullIfBlank(contact.middleName),
      lastName: contact.lastName.trim(),
      suffix: nullIfBlank(contact.suffix),
      relationship: requireValue(
        contact.relationship,
        'Emergency contact relationship'
      ),
      phone: toPhone(contact.contactNumber),
      address: toAddress(contact.address, 'Emergency contact address'),
      isPrimary: true,
    },
    addresses: values.addresses.map((address, index) => ({
      type: address.type,
      address: toAddress(address, `Address ${index + 1}`),
      isPrimary: index === 0,
    })),
    phones: values.phones.map((phone, index) => ({
      ownership: phone.ownership,
      phone: toPhone(phone),
      isPrimary: index === 0,
    })),
    emails: values.emails.map((email, index) => ({
      ownership: email.ownership,
      email: email.value.trim(),
      isPrimary: index === 0,
    })),
    hmo: toHmo(values.hmo),
    governmentIds: toGovernmentIds(values),
  };
};
