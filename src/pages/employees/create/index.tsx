import type { EmployeeCreateFormValues } from './types';

import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {
  alpha,
  styled,
  Box,
  Button,
  Stack,
  Step,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { FormProvider } from '~/components/form/form-provider';
import { SectionHeader } from '~/components/section-header';
import { AlertDialog } from '~/components/ui/alert-dialog';
import { Stepper, StepConnector, StepLabel } from './styled-components';

import { FOOTER_HEIGHT, PAGE_PADDING } from '~/layout/constants';
import { DEFAULT_VALUES } from './constants/default-values';
import { STEPS } from './constants/steps';

const ActionBar = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'isStuck',
})<{ isStuck: boolean }>(({ theme, isStuck }) => ({
  position: 'sticky',
  bottom: FOOTER_HEIGHT,
  zIndex: theme.zIndex.appBar - 1,
  margin: theme.spacing(0, -PAGE_PADDING.x, -PAGE_PADDING.y),
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, PAGE_PADDING.x),
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.divider}`,
  boxShadow: isStuck
    ? `0 -4px 12px ${alpha(theme.palette.common.black, 0.08)}`
    : 'none',
  transition: theme.transitions.create('box-shadow', {
    duration: theme.transitions.duration.short,
  }),
}));

const CreateEmployee = (): ReactElement => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeStep, setActiveStep] = useState(0);
  const [errorScrollRequest, setErrorScrollRequest] = useState(0);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  const [isBarStuck, setIsBarStuck] = useState(false);
  const barSentinelRef = useRef<HTMLDivElement>(null);

  const topRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  const methods = useForm<EmployeeCreateFormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });
  const { isDirty } = methods.formState;

  const { component: StepComponent, fields } = STEPS[activeStep];
  const isLastStep = activeStep === STEPS.length - 1;
  const previousStep = activeStep > 0 ? STEPS[activeStep - 1] : null;
  const nextStep = isLastStep ? null : STEPS[activeStep + 1];

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

  const handleCancel = (): void => {
    if (isDirty) {
      setIsDiscardOpen(true);
      return;
    }

    navigate('/employees');
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

  useEffect(() => {
    const sentinel = barSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsBarStuck(!entry.isIntersecting),
      { rootMargin: `0px 0px -${FOOTER_HEIGHT}px 0px` }
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return (
    <FormProvider {...methods} onSubmit={handleSubmit}>
      <Stack sx={{ gap: 2, position: 'relative' }} ref={topRef}>
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
        <ActionBar isStuck={isBarStuck}>
          <Button variant="text" color="inherit" onClick={handleCancel}>
            Cancel
          </Button>

          <Box sx={{ flex: 1 }} />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Step {activeStep + 1} of {STEPS.length}
          </Typography>

          {previousStep && (
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBackIcon fontSize="small" />}
              onClick={handleBack}
            >
              {isCompact ? 'Back' : previousStep.label}
            </Button>
          )}

          {nextStep ? (
            <Button
              key="next"
              variant="contained"
              endIcon={<ArrowForwardIcon fontSize="small" />}
              onClick={() => {
                void handleNext();
              }}
            >
              {isCompact ? 'Next' : nextStep.label}
            </Button>
          ) : (
            <Button
              key="submit"
              variant="contained"
              type="submit"
              startIcon={<CheckIcon fontSize="small" />}
            >
              Create employee
            </Button>
          )}
        </ActionBar>
        <Box
          ref={barSentinelRef}
          aria-hidden
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: (sxTheme) => sxTheme.spacing(-PAGE_PADDING.y),
            height: '1px',
            pointerEvents: 'none',
          }}
        />
      </Stack>

      <AlertDialog
        open={isDiscardOpen}
        title="Discard this employee?"
        description="Everything you've entered will be lost."
        confirmText="Discard"
        cancelText="Keep editing"
        onClose={() => setIsDiscardOpen(false)}
        onConfirm={() => navigate('/employees')}
      />
    </FormProvider>
  );
};

export default CreateEmployee;
