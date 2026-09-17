import type { Region, City, Barangay } from '~/models/location.models';
import { useState, type ReactElement } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
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

import { Form } from '~/components/form';
import { AuthCredentials } from './auth-credentials';
import { ContactDetails } from './contact-details';
import { EmploymentDetails } from './employment-details';
import { PersonalInfo } from './personal-info';

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
  addresses: Array<{
    addressLine1: string;
    addressLine2?: string;
    region: Region | null;
    city: City | null;
    barangay: Barangay | null;
    postalCode: string;
    formattedAddress: string;
  }>;
  phoneNumbers: Array<{
    countryCode: string;
    dialCode: string;
    international: string;
    local: string;
    formatted: string;
  }>;
  emails: Array<{ value: string }>;
  emergencyContact: {
    firstName: string;
    lastName: string;
    relationship: string;
    contactNumber: {
      countryCode: string;
      dialCode: string;
      international: string;
      local: string;
      formatted: string;
    };
    address: {
      addressLine1: string;
      addressLine2?: string;
      region: Region | null;
      city: City | null;
      barangay: Barangay | null;
      postalCode: string;
      formattedAddress: string;
    } | null;
  };
  employeeType: string;
  employeeId: string;
  departmentId: string;
  positionId: string;
  employmentStatus: string;
  joiningDate: Date | null;
};

const StyledStepper = styled(Stepper)(({ theme }) => ({
  width: '100%',
  flexShrink: 0,
  backgroundColor: theme.palette.grey[100],
  borderRadius: 50,
  padding: 8,
  boxShadow: 'inset 0px 1px 3px rgba(0,0,0,0.02)',
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
    borderColor: '#eaeaf0',
    borderTopWidth: 2,
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const StyleStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    fontSize: '0.925rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-disabled': {
      color: 'text.disabled',
    },
    '&.Mui-completed': {
      color: theme.palette.success.main,
    },
    '&.MuiStepLabel-alternativeLabel': {
      marginTop: '4px',
    },
  },
}));

const STEPS = [
  'Personal Information',
  'Contact Details',
  'Employment Details',
  'Auth Credentials',
];

const STEP_COMPONENTS = [
  PersonalInfo,
  ContactDetails,
  EmploymentDetails,
  AuthCredentials,
];

const Users = (): ReactElement => {
  const [activeStep, setActiveStep] = useState(0);
  const formState = useForm<FormValues>({
    defaultValues: {
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
      addresses: [],
      phoneNumbers: [],
      emails: [],
      emergencyContact: {
        firstName: '',
        lastName: '',
        relationship: '',
        contactNumber: {
          countryCode: '',
          dialCode: '',
          international: '',
          local: '',
          formatted: '',
        },
        address: null,
      },
    },
    shouldUnregister: false,
  });
  const StepComponent = STEP_COMPONENTS[activeStep];

  const handleSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

  return (
    <Form {...formState} onSubmit={handleSubmit}>
      <Stack spacing={3} sx={{ width: '100%', pt: 2 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            Create User
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set up a new user profile, access permission, and organization
            assignment.
          </Typography>
        </Box>
        <Stack spacing={3}>
          <StyledStepper
            activeStep={activeStep}
            connector={<StyledConnector />}
            alternativeLabel
          >
            {STEPS.map((step) => (
              <Step key={step}>
                <StyleStepLabel>{step}</StyleStepLabel>
              </Step>
            ))}
          </StyledStepper>
          <StepComponent />
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              bottom: 0,
            }}
          >
            <Button
              disabled={activeStep === 0}
              startIcon={<KeyboardDoubleArrowLeftIcon fontSize="small" />}
              onClick={() => setActiveStep((p) => p - 1)}
            >
              Back
            </Button>
            {activeStep === 3 ? (
              <Button variant="contained" type="submit">
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<KeyboardDoubleArrowRightIcon fontSize="small" />}
                onClick={() => setActiveStep((p) => p + 1)}
              >
                Next
              </Button>
            )}
          </Stack>
          <Button type="submit">Submit</Button>
        </Stack>
      </Stack>
    </Form>
  );
};

export default Users;
