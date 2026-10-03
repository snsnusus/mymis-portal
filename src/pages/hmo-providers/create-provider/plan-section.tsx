import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useFieldArray, useFormContext, useFormState } from 'react-hook-form';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import {
  emptyHmoPlanFormValues,
  type HmoProviderCreateFormValues,
} from '~/schema/hmo.schema';

import { PlanCard } from './plan-card';

export const PlanSection = (): ReactElement => {
  const { control } = useFormContext<HmoProviderCreateFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'plans' });
  const { errors, submitCount } = useFormState({ control, name: 'plans' });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const handledSubmitCountRef = useRef(0);

  useEffect(() => {
    if (submitCount === handledSubmitCountRef.current) {
      return;
    }
    handledSubmitCountRef.current = submitCount;

    const planErrors = errors.plans;
    if (!Array.isArray(planErrors)) {
      return;
    }
    const firstInvalidIndex = planErrors.findIndex(Boolean);
    if (firstInvalidIndex !== -1) {
      setExpandedIndex(firstInvalidIndex);
    }
  }, [submitCount, errors.plans]);

  const handleAdd = (): void => {
    append(emptyHmoPlanFormValues());
    setExpandedIndex(fields.length);
  };

  const handleRemove = (index: number): void => {
    remove(index);
    setExpandedIndex((current) => {
      if (current === null || current === index) {
        return null;
      }
      return current > index ? current - 1 : current;
    });
  };

  const handleToggle = (index: number): void => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  return (
    <Card variant="outlined">
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack>
          <Typography variant="h6">Plans</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Plans offered under this provider&apos;s contract, with their
            benefits and coverage.
          </Typography>
        </Stack>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add plan
        </Button>
      </Stack>

      <CardContent>
        {fields.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No plans yet. Add the plans included in this provider&apos;s
            contract. You can also add them later from the provider&apos;s page.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {fields.map((field, index) => (
              <PlanCard
                key={field.id}
                index={index}
                expanded={expandedIndex === index}
                onToggle={() => handleToggle(index)}
                onRemove={() => handleRemove(index)}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
