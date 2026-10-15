import type { WizardStep } from '../types';

import { AuthCredentials } from '../steps/auth-credentials';
import { ContactDetails } from '../steps/contact-details';
import { EmploymentDetails } from '../steps/employment-details';
import { PersonalInfo } from '../steps/personal-info';

export const STEPS: WizardStep[] = [
  {
    label: 'Personal Information',
    component: PersonalInfo,
    fields: [
      'firstName',
      'middleName',
      'lastName',
      'suffix',
      'gender',
      'maritalStatus',
      'birthdate',
      'birthplace',
      'nationality',
      'avatar',
      'avatarStyle',
    ],
  },
  {
    label: 'Contact Details',
    component: ContactDetails,
    fields: ['addresses', 'phones', 'emails', 'emergencyContact'],
  },
  {
    label: 'Employment Details',
    component: EmploymentDetails,
    fields: [
      'employeeType',
      'departmentId',
      'positionId',
      'employmentStatus',
      'joiningDate',
      'hmo',
    ],
  },
  {
    label: 'Auth Credentials',
    component: AuthCredentials,
    fields: ['username', 'password'],
  },
];
