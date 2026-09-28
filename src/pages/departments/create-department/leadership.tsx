import { type UserOption } from '~/models/user.models';
import { useState, type ReactElement } from 'react';

import {
  createFilterOptions,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import { ControlledUserLookup } from '~/components/modules/user-lookup';
import { AlertDialog } from '~/components/ui/alert-dialog';
import DataDisplayRow from '~/components/ui/data-display-row';
import { useFormContext } from 'react-hook-form';

const defaultFilter = createFilterOptions<UserOption>({
  stringify: (option) => option.formattedName,
});

export const Leadership = (): ReactElement => {
  const { setValue, watch } = useFormContext();

  const primaryContact = watch('primaryContact');
  const secondaryContact = watch('secondaryContact');

  // Interception State
  const [pendingSelection, setPendingSelection] = useState<{
    fieldName: 'primaryContact' | 'secondaryContact';
    user: UserOption | null;
  } | null>(null);

  /**
   * Interceptor function triggered before React Hook Form updates state
   */
  const handleInterceptSelection = (
    fieldName: 'primaryContact' | 'secondaryContact',
    selectedUser: UserOption | null
  ): void => {
    // 1. If cleared (selectedUser is null), update form state immediately
    if (!selectedUser) {
      setValue(fieldName, null, { shouldValidate: true, shouldDirty: true });
      return;
    }

    // 2. Check if the user already has a department
    if (selectedUser.departmentId) {
      // INTERCEPT: Save selection to local state to trigger the modal instead of updating RHF
      setPendingSelection({ fieldName, user: selectedUser });
    } else {
      // NO CONFLICT: Update React Hook Form state directly
      setValue(fieldName, selectedUser, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  /**
   * Modal Confirmation Handler
   */
  const handleConfirmTransfer = (): void => {
    if (pendingSelection?.user) {
      // Commit the selection to React Hook Form state now
      setValue(pendingSelection.fieldName, pendingSelection.user, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    setPendingSelection(null); // Close modal
  };

  return (
    <>
      <Card variant="outlined">
        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Leadership & Contacts
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Assign key personnel responsible for department escalations and
            approvals.
          </Typography>
        </Box>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="Primary Contact *">
                <ControlledUserLookup
                  name="primaryContact"
                  filterOptions={(options, state) => {
                    const filtered = defaultFilter(options, state);
                    return filtered.filter(
                      (user) => user.id !== secondaryContact?.id
                    );
                  }}
                  onChange={(_, newValue) =>
                    handleInterceptSelection(
                      'primaryContact',
                      newValue as UserOption
                    )
                  }
                />
              </DataDisplayRow>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="Secondary Contact">
                <ControlledUserLookup
                  name="secondaryContact"
                  filterOptions={(options, state) => {
                    const filtered = defaultFilter(options, state);
                    return filtered.filter(
                      (user) => user.id !== primaryContact?.id
                    );
                  }}
                  onChange={(_, newValue) =>
                    handleInterceptSelection(
                      'secondaryContact',
                      newValue as UserOption
                    )
                  }
                />
              </DataDisplayRow>
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
