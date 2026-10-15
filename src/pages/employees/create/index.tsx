import type { EmployeeCreateFormValues } from './types';

import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { styled, Box, Button, Stack, Step } from '@mui/material';
import {
  KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
  KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
} from '@mui/icons-material';
import { FormProvider } from '~/components/form/form-provider';
import { SectionHeader } from '~/components/section-header';
import { Stepper, StepConnector, StepLabel } from './components/styled';

import { DEFAULT_VALUES } from './config/default-values';
import { STEPS } from './config/steps';

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
  const [activeStep, setActiveStep] = useState(2);
  const [errorScrollRequest, setErrorScrollRequest] = useState(0);

  const topRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  const methods = useForm<EmployeeCreateFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const { component: StepComponent, fields } = STEPS[activeStep];
  const isLastStep = activeStep === STEPS.length - 1;

  const handleNext = async (): Promise<void> => {
    const isStepValid = await methods.trigger(fields);
    if (isStepValid) {
      setActiveStep((step) => step + 1);
      return;
    }

    setErrorScrollRequest((count) => count + 1);
  };

  const handleBack = (): void => {
    setActiveStep((step) => step - 1);
  };

  const handleSubmit: SubmitHandler<EmployeeCreateFormValues> = (data) =>
    console.log(data);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeStep]);

  useEffect(() => {
    if (errorScrollRequest === 0) return;

    const firstError =
      stepRef.current?.querySelector<HTMLElement>('.Mui-error');
    if (!firstError) return;

    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstError
      .closest('.MuiFormControl-root')
      ?.querySelector<HTMLInputElement>('input:not([disabled])')
      ?.focus({ preventScroll: true });
  }, [errorScrollRequest]);

  return (
    <FormProvider {...methods} onSubmit={handleSubmit}>
      <Stack spacing={2} ref={topRef}>
        <SectionHeader
          header="Create Employee"
          subheader="Set up a new employee profile, access permission, and organization
            assignment."
        />
        <Stepper
          activeStep={activeStep}
          connector={<StepConnector />}
          alternativeLabel
        >
          {STEPS.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box ref={stepRef}>
          <StepComponent />
        </Box>
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
