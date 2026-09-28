import { useState, type ReactElement } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import DataDisplayRow from '~/components/ui/data-display-row';
import { Form } from '~/components/form';
import { ControlledTextField } from '~/components/form/controlled/textfield';
import { ControlledSwitch } from '~/components/form/controlled/switch';
// import { Autocomplete } from '~/components/form/base/autocomplete';

import {
  type HMOPlanFormValues,
  type HMOProviderFormValues,
} from './hmo-provider.schema';
import {
  MEMBER_ROLE_OPTIONS,
  TIER_OPTIONS,
  ROOM_BOARD_OPTIONS,
} from './constants';
const FIELD_CONFIG = { row: { flexDirection: 'column' as const, gap: 1 } };

const PlanDialog = ({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (values: HMOPlanFormValues) => void;
}): ReactElement => {
  const formMethods = useForm<HMOPlanFormValues>({
    defaultValues: {
      planName: '',
      memberRole: '',
      mblAmount: 0,
      tier: '',
      roomType: '',
      premiumCost: 0,
      employerSubsidyPercentage: 0,
      hasDental: false,
      hasApe: false,
      pecCovered: false,
      pecLimit: 0,
      planWebsiteUrl: '',
      duplicateEnabled: false,
    },
  });

  const pecCovered = formMethods.watch('pecCovered');
  const memberRole = formMethods.watch('memberRole');
  const duplicateEnabled = formMethods.watch('duplicateEnabled');

  const otherRole = memberRole === 'Principal' ? 'Dependent' : 'Principal';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Form {...formMethods} onSubmit={(data) => onSave(data)}>
        <DialogTitle>Add Plan</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <DataDisplayRow label="Plan Name *" config={FIELD_CONFIG}>
                <ControlledTextField name="planName" />
              </DataDisplayRow>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DataDisplayRow label="Member Role *" config={FIELD_CONFIG}>
                <ControlledTextField name="memberRole" select>
                  {MEMBER_ROLE_OPTIONS.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </ControlledTextField>
              </DataDisplayRow>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DataDisplayRow
                label="Maximum Benefit Limit *"
                config={FIELD_CONFIG}
              >
                <ControlledTextField name="mblAmount" />
              </DataDisplayRow>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DataDisplayRow label="Tier *" config={FIELD_CONFIG}>
                <ControlledTextField name="tier" select>
                  {TIER_OPTIONS.map((tier) => (
                    <MenuItem key={tier} value={tier}>
                      {tier}
                    </MenuItem>
                  ))}
                </ControlledTextField>
              </DataDisplayRow>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DataDisplayRow label="Room & Board *" config={FIELD_CONFIG}>
                <ControlledTextField name="roomType" select>
                  {ROOM_BOARD_OPTIONS.map((room) => (
                    <MenuItem key={room} value={room}>
                      {room}
                    </MenuItem>
                  ))}
                </ControlledTextField>
              </DataDisplayRow>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DataDisplayRow label="Premium Cost *" config={FIELD_CONFIG}>
                <ControlledTextField name="premiumCost" />
              </DataDisplayRow>
            </Grid>
            <Grid size={12}>
              <DataDisplayRow
                label="Employer Subsidy (%) *"
                config={FIELD_CONFIG}
              >
                <ControlledTextField name="employerSubsidyPercentage" />
              </DataDisplayRow>
            </Grid>
            <Grid size={6}>
              <DataDisplayRow label="Has Dental?">
                <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                  <ControlledSwitch name="hasDental" />
                </Stack>
              </DataDisplayRow>
            </Grid>
            <Grid size={6}>
              <DataDisplayRow label="Has APE?">
                <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                  <ControlledSwitch name="hasApe" />
                </Stack>
              </DataDisplayRow>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="PEC Covered?">
                <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                  <ControlledSwitch name="pecCovered" />
                </Stack>
              </DataDisplayRow>
            </Grid>
            {pecCovered && (
              <Grid size={12}>
                <DataDisplayRow label="PEC Limit *" config={FIELD_CONFIG}>
                  <ControlledTextField name="pecLimit" />
                </DataDisplayRow>
              </Grid>
            )}
            <Grid size={12}>
              <DataDisplayRow label="Website URL" config={FIELD_CONFIG}>
                <ControlledTextField name="planWebsiteUrl" />
              </DataDisplayRow>
            </Grid>
            <Grid size={12}>
              <Stack
                direction="row"
                sx={{
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Create a duplicate?:
                </Typography>
                <Stack
                  direction="row"
                  sx={{
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                  }}
                >
                  <ControlledSwitch
                    name="duplicateEnabled"
                    disabled={!memberRole}
                  />
                </Stack>
              </Stack>
            </Grid>
            {!!memberRole && duplicateEnabled && (
              <Stack sx={{ gap: 2 }}>
                <Typography>
                  Creating duplicate for:{' '}
                  <Typography component="span" sx={{ fontWeight: 600 }}>
                    {otherRole}
                  </Typography>
                </Typography>
                <Alert
                  variant="outlined"
                  color="info"
                  icon={<InfoIcon fontSize="large" />}
                  sx={{
                    '& .MuiAlert-icon': {
                      alignItems: 'center',
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ display: 'block' }}
                  >
                    Saving will create two plans: this one as{' '}
                    <Typography
                      component="span"
                      color="primary"
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      &quot;{memberRole ?? '—'}&quot;
                    </Typography>{' '}
                    and a duplicate as{' '}
                    <Typography
                      component="span"
                      color="primary"
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      &quot;{otherRole ?? '—'}&quot;
                    </Typography>{' '}
                    , with all other fields identical.
                  </Typography>
                </Alert>
              </Stack>
            )}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
          }}
        >
          <Button
            onClick={onClose}
            color="inherit"
            sx={{
              minWidth: 120,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              minWidth: 120,
            }}
          >
            Save Plan
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export const PlansSection = (): ReactElement => {
  const { control } = useFormContext<HMOProviderFormValues>();
  const { fields: plans, remove } = useFieldArray({
    control,
    name: 'plans',
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenAdd = (): void => {
    setDialogOpen(true);
  };

  const handleSave = (values: HMOPlanFormValues): void => {
    console.log({ ...values }, 'values');
  };

  return (
    <Card variant="outlined">
      <Box
        sx={{
          p: 2,
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Plans
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Manage the coverage tiers, benefit limits, and room allowances
            available under this provider.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Add Plan
        </Button>
      </Box>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            {plans.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                No plans added yet.
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Plan Name</TableCell>
                    <TableCell>Tier</TableCell>
                    <TableCell>Room Type</TableCell>
                    <TableCell align="right">MBL</TableCell>
                    <TableCell align="right">Premium</TableCell>
                    <TableCell>Benefits</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plans.map((plan, index) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        {(plan as unknown as HMOPlanFormValues).planName}
                      </TableCell>
                      <TableCell>
                        {(plan as unknown as HMOPlanFormValues).tier}
                      </TableCell>
                      <TableCell>
                        {(plan as unknown as HMOPlanFormValues).roomType}
                      </TableCell>
                      <TableCell align="right">
                        {(
                          plan as unknown as HMOPlanFormValues
                        ).mblAmount.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {(
                          plan as unknown as HMOPlanFormValues
                        ).premiumCost.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{
                            flexWrap: 'wrap',
                          }}
                        >
                          {(plan as unknown as HMOPlanFormValues).hasDental && (
                            <Chip size="small" label="Dental" />
                          )}
                          {(plan as unknown as HMOPlanFormValues).hasApe && (
                            <Chip size="small" label="APE" />
                          )}
                          {(plan as unknown as HMOPlanFormValues)
                            .pecCovered && <Chip size="small" label="PEC" />}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => remove(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Grid>
        </Grid>
      </CardContent>

      {dialogOpen && (
        <PlanDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </Card>
  );
};
