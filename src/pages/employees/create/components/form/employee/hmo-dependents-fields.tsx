import type { EmployeeCreateFormValues } from '../../../types';
import { type ReactElement } from 'react';

import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import { ControlledAutocomplete } from '~/components/form/inputs/controlled/autocomplete';
import ControlledDateOnlyPicker from '~/components/form/inputs/controlled/date-only-picker';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { SectionLabel } from '~/components/section-label';

import {
  HMO_DEPENDENT_RELATIONSHIPS,
  type HmoPlanLookup,
} from '~/models/hmo.model';
import { EMPTY_HMO_DEPENDENT } from '../../../config/default-values';

import { isDuplicate } from '~/utils/array.util';
import { dateToDateOnly } from '~/utils/date.util';

interface HmoDependentsFieldProps {
  /** The selected provider's active plans; only those allowing dependents are offered. */
  plans: HmoPlanLookup[];
}

export const HmoDependentsField = ({
  plans,
}: HmoDependentsFieldProps): ReactElement => {
  const { control, getValues } = useFormContext<EmployeeCreateFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hmo.dependents',
  });

  const dependentPlans = plans.filter((plan) => plan.allowDependents);
  const today = dateToDateOnly(new Date());

  // New rows start on the employee's plan when that plan allows dependents.
  const handleAdd = (): void => {
    const employeePlanId = getValues('hmo.hmoPlanId');
    const defaultPlanId = dependentPlans.some((p) => p.id === employeePlanId)
      ? employeePlanId
      : null;

    append({ ...EMPTY_HMO_DEPENDENT, hmoPlanId: defaultPlanId });
  };

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Stack sx={{ flexGrow: 1, mr: 2 }}>
          <SectionLabel title="Dependents" />
        </Stack>
        <Button
          variant="outlined"
          size="small"
          startIcon={<GroupAddIcon />}
          onClick={handleAdd}
        >
          Add Dependent
        </Button>
      </Stack>

      {fields.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          No dependents added yet.
        </Typography>
      )}

      {fields.map((field, index) => {
        const prefix = `hmo.dependents.${index}` as const;

        return (
          <Paper key={field.id} variant="outlined" sx={{ p: 2 }}>
            <Stack
              direction="row"
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Dependent {index + 1}
              </Typography>
              <Tooltip title="Remove dependent" placement="top-start" arrow>
                <IconButton
                  aria-label={`Remove dependent ${index + 1}`}
                  sx={{ '&:hover': { color: 'error.main' } }}
                  onClick={() => remove(index)}
                >
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <ControlledTextField
                  label="First Name *"
                  name={`${prefix}.firstName`}
                  rules={{
                    required: 'First name is required.',
                    maxLength: { value: 100, message: 'Max 100 characters.' },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <ControlledTextField
                  label="Middle Name"
                  name={`${prefix}.middleName`}
                  rules={{
                    maxLength: { value: 100, message: 'Max 100 characters.' },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <ControlledTextField
                  label="Last Name *"
                  name={`${prefix}.lastName`}
                  rules={{
                    required: 'Last name is required.',
                    maxLength: { value: 100, message: 'Max 100 characters.' },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <ControlledTextField
                  label="Suffix"
                  name={`${prefix}.suffix`}
                  rules={{
                    maxLength: { value: 20, message: 'Max 20 characters.' },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <ControlledDateOnlyPicker
                  label="Birthdate *"
                  name={`${prefix}.birthdate`}
                  rules={{
                    required: 'Birthdate is required.',
                    validate: (value: string) =>
                      !value ||
                      value <= today ||
                      'Birthdate cannot be in the future.',
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ControlledTextField
                  label="Relationship *"
                  name={`${prefix}.relationship`}
                  select
                  rules={{ required: 'Relationship is required.' }}
                >
                  {HMO_DEPENDENT_RELATIONSHIPS.map((relationship) => (
                    <MenuItem key={relationship} value={relationship}>
                      {relationship}
                    </MenuItem>
                  ))}
                </ControlledTextField>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ControlledTextField
                  label="Member Number"
                  name={`${prefix}.memberNumber`}
                  rules={{
                    maxLength: { value: 50, message: 'Max 50 characters.' },
                    validate: (value: string) => {
                      const memberNumber = value.trim();
                      if (!memberNumber) return true;

                      const others = getValues('hmo.dependents').filter(
                        (_, i) => i !== index
                      );
                      return (
                        !isDuplicate(
                          others,
                          memberNumber,
                          (d) => d.memberNumber.trim(),
                          {
                            ignoreCase: true,
                          }
                        ) ||
                        'Another dependent already uses this member number.'
                      );
                    },
                  }}
                />
              </Grid>

              <Grid size={12}>
                <ControlledAutocomplete<HmoPlanLookup>
                  label="Plan *"
                  name={`${prefix}.hmoPlanId`}
                  valueKey="id"
                  options={dependentPlans}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option?.name ?? ''
                  }
                  placeholder="Select plan"
                  noOptionsText="This provider has no plans that allow dependents."
                  rules={{ required: 'Plan is required.' }}
                />
              </Grid>
            </Grid>
          </Paper>
        );
      })}
    </Stack>
  );
};
