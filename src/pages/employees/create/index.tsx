import type { Region } from '~/models/region.model';
import type { City } from '~/models/city.model';
import type { Barangay } from '~/models/barangay.model';
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactElement,
} from 'react';
import { useForm, type FieldPath, type SubmitHandler } from 'react-hook-form';
import {
  styled,
  Stepper,
  StepConnector,
  Step,
  StepLabel,
  Button,
  Stack,
  stepConnectorClasses,
  Box,
  Typography,
} from '@mui/material';
import {
  KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
  KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
} from '@mui/icons-material';
import { FormProvider } from '~/components/form/form-provider';
import { AuthCredentials } from './auth-credentials';
import { ContactDetails } from './contact-details';
import { EmploymentDetails } from './employment-details';
import { PersonalInfo } from './personal-info';
import type {
  AvatarStyle,
  EmployeeType,
  EmploymentStatus,
} from '~/models/employee.model';

type AddressValues = {
  addressLine1: string;
  addressLine2?: string;
  region: Region | null;
  city: City | null;
  barangay: Barangay | null;
  postalCode: string;
  formattedAddress: string;
};

type PhoneValues = {
  countryCode: string;
  dialCode: string;
  international: string;
  local: string;
  formatted: string;
};

export type FormValues = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  gender: string;
  maritalStatus?: string;
  birthdate: Date | null;
  birthplace?: string;
  nationality?: string;
  avatar: File | null;
  avatarStyle: AvatarStyle | null;
  addresses: AddressValues[];
  phoneNumbers: PhoneValues[];
  emails: Array<{ value: string }>;
  emergencyContact: {
    firstName: string;
    middleName: string;
    lastName: string;
    suffix?: string;
    relationship: string;
    contactNumber: PhoneValues;
    address: AddressValues | null;
  };
  employeeType: EmployeeType | '';
  employmentStatus: EmploymentStatus | '';
  departmentId: number | null;
  positionId: number | null;
  joiningDate: Date | null;
  username: string;
  password: string;
};

type WizardStep = {
  label: string;
  component: ComponentType;
  fields: FieldPath<FormValues>[];
};

const STEPS: WizardStep[] = [
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
    fields: ['addresses', 'phoneNumbers', 'emails', 'emergencyContact'],
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
    ],
  },
  {
    label: 'Auth Credentials',
    component: AuthCredentials,
    fields: ['username', 'password'],
  },
];

const EMPTY_PHONE: PhoneValues = {
  countryCode: '',
  dialCode: '',
  international: '',
  local: '',
  formatted: '',
};

const DEFAULT_VALUES: FormValues = {
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
  phoneNumbers: [],
  emails: [],
  emergencyContact: {
    firstName: '',
    middleName: '',
    lastName: '',
    relationship: '',
    contactNumber: EMPTY_PHONE,
    address: null,
  },
  employeeType: '',
  departmentId: null,
  positionId: null,
  employmentStatus: '',
  joiningDate: null,
  username: '',
  password: '',
};

const StyledStepper = styled(Stepper)(({ theme }) => ({
  width: '100%',
  flexShrink: 0,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 50,
  padding: theme.spacing(1),
  '& .MuiStep-root': {
    flex: 1,
  },
  '& .MuiStepLabel-label': {
    whiteSpace: 'normal',
    textAlign: 'center',
    minWidth: 0,
  },
  '& .MuiStepIcon-root.Mui-active': {
    color: theme.palette.primary.main,
  },
  '& .MuiStepIcon-root.Mui-completed': {
    color: theme.palette.success.main,
  },
}));

const StyledConnector = styled(StepConnector)(({ theme }) => ({
  flexShrink: 0,
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderStyle: 'none',
      height: 2,
      display: 'block',
      background: `linear-gradient(
        to right,
        ${theme.palette.success.main} 0%,
        ${theme.palette.success.main} 50%,
        ${theme.palette.primary.main} 50%,
        ${theme.palette.primary.main} 100%
      )`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
    borderTopWidth: 2,
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    fontSize: theme.typography.body1.fontSize,
    color: theme.palette.text.primary,
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-disabled': {
      color: theme.palette.text.disabled,
    },
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
    '&.MuiStepLabel-alternativeLabel': {
      marginTop: theme.spacing(1),
    },
  },
}));

// Stays pinned to the bottom of the viewport while the step content scrolls.
const ActionBar = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  zIndex: theme.zIndex.appBar - 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const CreateEmployee = (): ReactElement => {
  const [activeStep, setActiveStep] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const methods = useForm<FormValues>({ defaultValues: DEFAULT_VALUES });

  const { component: StepComponent, fields } = STEPS[activeStep];
  const isLastStep = activeStep === STEPS.length - 1;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeStep]);

  const handleNext = async (): Promise<void> => {
    const isStepValid = await methods.trigger(fields);
    if (isStepValid) {
      setActiveStep((step) => step + 1);
    }
  };

  const handleBack = (): void => {
    setActiveStep((step) => step - 1);
  };

  const handleSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

  return (
    <FormProvider {...methods} onSubmit={handleSubmit}>
      <Stack spacing={2} ref={topRef}>
        <Box>
          <Typography variant="h6">Create Employee</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Set up a new employee profile, access permission, and organization
            assignment.
          </Typography>
        </Box>
        <StyledStepper
          activeStep={activeStep}
          connector={<StyledConnector />}
          alternativeLabel
        >
          {STEPS.map((step) => (
            <Step key={step.label}>
              <StyledStepLabel>{step.label}</StyledStepLabel>
            </Step>
          ))}
        </StyledStepper>
        <StepComponent />
        <ActionBar>
          <Button
            variant="contained"
            disabled={activeStep === 0}
            startIcon={<KeyboardDoubleArrowLeftIcon fontSize="small" />}
            onClick={handleBack}
          >
            Back
          </Button>
          {isLastStep ? (
            <Button key="submit" variant="contained" type="submit">
              Submit
            </Button>
          ) : (
            <Button
              key="next"
              variant="contained"
              endIcon={<KeyboardDoubleArrowRightIcon fontSize="small" />}
              onClick={() => {
                void handleNext();
              }}
            >
              Next
            </Button>
          )}
        </ActionBar>
      </Stack>
    </FormProvider>
  );
};

export default CreateEmployee;
