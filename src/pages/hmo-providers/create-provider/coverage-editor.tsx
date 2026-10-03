import { type ReactElement } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { emptyCoverageGroup } from '~/schema/hmo.schema';
import { CoverageGroupCard } from './coverage-group-card';
import { getFieldName } from '../utils';

interface CoverageEditorProps {
  namePrefix?: string;
}

export const CoverageEditor = ({
  namePrefix,
}: CoverageEditorProps): ReactElement => {
  const { control } = useFormContext();
  const groupsName = getFieldName(namePrefix, 'coverageGroups');
  const { fields, append, remove } = useFieldArray({
    control,
    name: groupsName,
  });

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Coverage
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => append(emptyCoverageGroup())}
        >
          Add category
        </Button>
      </Stack>

      {fields.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No coverage yet. Add categories as they appear in the provider's
          brochure, such as Inpatient care and Outpatient care.
        </Typography>
      ) : (
        fields.map((field, index) => (
          <CoverageGroupCard
            key={field.id}
            groupName={`${groupsName}.${index}`}
            groupNumber={index + 1}
            onRemove={() => remove(index)}
          />
        ))
      )}
    </Stack>
  );
};
