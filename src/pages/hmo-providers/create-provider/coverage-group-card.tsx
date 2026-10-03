import { type ReactElement } from 'react';
import {
  get,
  useFieldArray,
  useFormContext,
  useFormState,
} from 'react-hook-form';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import { ControlledCurrencyInput } from '~/components/form/inputs/controlled/currency-input';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { emptyCoverageItem } from '~/schema/hmo.schema';

import { CURRENCY_SYMBOL } from '../constants';

interface CoverageGroupCardProps {
  /** Full path of this group, e.g. 'plans.0.coverageGroups.1'. */
  groupName: string;
  groupNumber: number;
  onRemove: () => void;
}

interface ArrayFieldError {
  message?: string;
  root?: { message?: string };
}

export const CoverageGroupCard = ({
  groupName,
  groupNumber,
  onRemove,
}: CoverageGroupCardProps): ReactElement => {
  const { control } = useFormContext();
  const itemsName = `${groupName}.items`;
  const { fields, append, remove } = useFieldArray({
    control,
    name: itemsName,
  });

  const { errors } = useFormState({ name: itemsName });
  const itemsError = get(errors, itemsName) as ArrayFieldError | undefined;
  const itemsErrorMessage = itemsError?.message ?? itemsError?.root?.message;

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <ControlledTextField
            label="Category *"
            name={`${groupName}.category`}
            placeholder="e.g. Inpatient Care, Outpatient Care, etc."
            size="small"
            fullWidth
          />
          <IconButton
            aria-label={`Remove category ${groupNumber}`}
            onClick={onRemove}
            sx={{ mt: 0.5 }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>

        {fields.map((field, itemIndex) => {
          const itemName = `${itemsName}.${itemIndex}`;
          return (
            <Grid
              key={field.id}
              container
              spacing={2}
              sx={{ alignItems: 'flex-start' }}
            >
              <Grid size={{ xs: 12, md: 5 }}>
                <ControlledTextField label="Item *" name={`${itemName}.name`} />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <ControlledCurrencyInput
                  label="Limit"
                  name={`${itemName}.limitAmount`}
                  currencySymbol={CURRENCY_SYMBOL}
                />
              </Grid>
              <Grid size={{ xs: 5, md: 3 }}>
                <ControlledTextField label="Notes" name={`${itemName}.notes`} />
              </Grid>
              <Grid size={1}>
                <IconButton
                  aria-label={`Remove item ${
                    itemIndex + 1
                  } from category ${groupNumber}`}
                  onClick={() => remove(itemIndex)}
                  size="small"
                  sx={{ mt: 0.5 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}

        {itemsErrorMessage && (
          <Typography variant="caption" color="error">
            {itemsErrorMessage}
          </Typography>
        )}

        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => append(emptyCoverageItem())}
            sx={{
              minWidth: 150,
            }}
          >
            Add item
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
