import type { HmoPlanLookup, HmoProviderLookup } from '~/models/hmo.model';
import type { EmployeeCreateFormValues } from '../../../types';

import { type ReactElement } from 'react';

import {
  useGetHmoPlanLookup,
  useGetHmoProviderLookup,
} from '~/queries/hmo.query';
import { useFormContext, useWatch } from 'react-hook-form';

import { Grid, Stack, Typography } from '@mui/material';

import { ControlledAutocomplete } from '~/components/form/inputs/controlled/autocomplete';
import ControlledDateOnlyPicker from '~/components/form/inputs/controlled/date-only-picker';
import { ControlledSwitch } from '~/components/form/inputs/controlled/switch';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { SectionLabel } from '~/components/section-label';

import { HmoDependentsField } from './hmo-dependents-fields';

export const HmoEnrollmentForm = (): ReactElement => {
  const { control, getValues, setValue } =
    useFormContext<EmployeeCreateFormValues>();

  const isEnrolled = useWatch({ control, name: 'hmo.isEnrolled' });
  const providerId = useWatch({ control, name: 'hmo.hmoProviderId' });

  const { data: providers = [], isFetching: isFetchingProviders } =
    useGetHmoProviderLookup();
  const { data: plans = [], isFetching: isFetchingPlans } =
    useGetHmoPlanLookup(providerId);

  const handleProviderChange = (): void => {
    setValue('hmo.hmoPlanId', null);
    getValues('hmo.dependents').forEach((_, index) => {
      setValue(`hmo.dependents.${index}.hmoPlanId`, null);
    });
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        component="label"
        direction="row"
        sx={{ alignItems: 'center', gap: 2, cursor: 'pointer' }}
      >
        <ControlledSwitch<
          EmployeeCreateFormValues,
          'hmo.isEnrolled'
        > name="hmo.isEnrolled" />
        <Typography variant="body1">Enroll in HMO</Typography>
      </Stack>

      {isEnrolled ? (
        <>
          <Stack sx={{ gap: 1 }}>
            <SectionLabel title="Primary" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <ControlledAutocomplete<HmoProviderLookup>
                  label="Provider *"
                  name="hmo.hmoProviderId"
                  valueKey="id"
                  options={providers}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option?.name ?? ''
                  }
                  loading={isFetchingProviders}
                  placeholder="Select provider"
                  rules={{ required: 'Provider is required.' }}
                  onChange={handleProviderChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <ControlledAutocomplete<HmoPlanLookup>
                  label="Plan *"
                  name="hmo.hmoPlanId"
                  valueKey="id"
                  options={plans}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option?.name ?? ''
                  }
                  loading={isFetchingPlans}
                  disabled={providerId === null}
                  placeholder="Select plan"
                  rules={{ required: 'Plan is required.' }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ControlledTextField
                  label="Member Number *"
                  name="hmo.memberNumber"
                  rules={{
                    required: 'Member number is required.',
                    maxLength: {
                      value: 50,
                      message: 'Member number must be 50 characters or fewer.',
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ControlledDateOnlyPicker
                  label="Effective Date *"
                  name="hmo.effectiveDate"
                  rules={{
                    required: 'Effective date is required.',
                    deps: 'hmo.endDate', // re-check the end date when this changes
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ControlledDateOnlyPicker
                  label="End Date"
                  name="hmo.endDate"
                  helperText="Leave empty if there's no end date yet."
                  rules={{
                    validate: (value: string) => {
                      const effectiveDate = getValues('hmo.effectiveDate');
                      return (
                        !value ||
                        !effectiveDate ||
                        value > effectiveDate ||
                        'End date must be after the effective date.'
                      );
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Stack>

          <HmoDependentsField plans={plans} />
        </>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Not enrolled. Turn on to set the provider, plan and dependents.
        </Typography>
      )}
    </Stack>
  );
};
