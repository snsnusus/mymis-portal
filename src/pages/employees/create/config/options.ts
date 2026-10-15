import type { EmergencyContactRelationship } from '~/models/employee.model';

export const GENDER_OPTIONS = [
  {
    label: 'Male',
    value: 'MALE',
  },
  {
    label: 'Female',
    value: 'FEMALE',
  },
];

export const MARITAL_STATUS_OPTIONS = [
  {
    label: 'Single',
    value: 'SINGLE',
  },
  {
    label: 'Married',
    value: 'MARRIED',
  },
];

export const NATIONALITY_OPTIONS = [
  {
    label: 'Filipino',
    value: 'FILIPINO',
  },
];

export const RELATIONSHIP_OPTIONS: {
  value: EmergencyContactRelationship;
  label: string;
}[] = [
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Partner', label: 'Partner' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Guardian', label: 'Guardian' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Child', label: 'Child' },
  { value: 'Relative', label: 'Relative' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Other', label: 'Other' },
];

export const EMPLOYEE_TYPE_OPTIONS = [
  {
    label: 'CLIENT',
    value: 'Client',
  },
  {
    label: 'MANAGEMENT',
    value: 'Management',
  },
];
