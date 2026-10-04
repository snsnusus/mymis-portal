import type { EmployeeOption } from '~/models/employee.model';
import { useState, type ReactElement } from 'react';

import { Card, CardContent, Grid, Typography, Stack } from '@mui/material';

import { ControlledUserLookup } from '~/components/modules/user-lookup';
import { AlertDialog } from '~/components/ui/alert-dialog';
import { useFormContext } from 'react-hook-form';

export const Leadership = (): ReactElement => {
  const { setValue, watch } = useFormContext();

  const primaryContact = watch('primaryContact');
  const secondaryContact = watch('secondaryContact');

  const [pendingSelection, setPendingSelection] = useState<{
    fieldName: 'primaryContact' | 'secondaryContact';
    user: EmployeeOption | null;
  } | null>(null);

  const handleInterceptSelection = (
    fieldName: 'primaryContact' | 'secondaryContact',
    selectedUser: EmployeeOption | null
  ): void => {
    if (!selectedUser) {
      setValue(fieldName, null, { shouldValidate: true, shouldDirty: true });
      return;
    }

    if (selectedUser.departmentId) {
      setPendingSelection({ fieldName, user: selectedUser });
    } else {
      setValue(fieldName, selectedUser, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleConfirmTransfer = (): void => {
    if (pendingSelection?.user) {
      setValue(pendingSelection.fieldName, pendingSelection.user, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    setPendingSelection(null);
  };

  return (
    <>
      <Card variant="outlined">
        <Stack
          sx={{
            p: 2,
            flexWrap: 'wrap',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6">Leadership & Contacts</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Assign key personnel responsible for department escalations and
            approvals.
          </Typography>
        </Stack>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ControlledUserLookup
                label="Primary Contact"
                name="primaryContact"
                filterOptions={(options) =>
                  options.filter((user) => user.id !== secondaryContact?.id)
                }
                onChange={(_, newValue) =>
                  handleInterceptSelection(
                    'primaryContact',
                    newValue as EmployeeOption
                  )
                }
                placeholder="Select employee..."
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <ControlledUserLookup
                label="Secondary Contact"
                name="secondaryContact"
                filterOptions={(options) =>
                  options.filter((user) => user.id !== primaryContact?.id)
                }
                onChange={(_, newValue) =>
                  handleInterceptSelection(
                    'secondaryContact',
                    newValue as EmployeeOption
                  )
                }
                placeholder="Select employee..."
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <AlertDialog
        open={Boolean(pendingSelection)}
        onClose={() => setPendingSelection(null)}
        onConfirm={handleConfirmTransfer}
        title="Change Department Assignment?"
        description={
          <>
            <strong>{pendingSelection?.user?.formattedName}</strong> is already
            assigned to a different department.
            <br />
            Assigning them here will transfer them to this department.
            <br />
            <br />
            Would you like to continue?
          </>
        }
        confirmText="Yes, Continue"
        cancelText="Cancel"
      />
    </>
  );
};
