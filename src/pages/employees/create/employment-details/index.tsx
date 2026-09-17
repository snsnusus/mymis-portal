import type { Department } from '~/models/department.models';
import { type ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  useGetAllDepartments,
  useGetPositionsByDepartment,
} from '~/hooks/department.hook';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ControlledAutocomplete } from '~/components/form/controlled/autocomplete';
import { ControlledTextField } from '~/components/form/controlled/textfield';
import ControlledDatePicker from '~/components/form/controlled/controlled-datepicker';
import DataDisplayRow from '~/components/ui/data-display-row';
import { generateMockEmployeeId } from '~/utils';

export const EmploymentDetails = (): ReactElement => {
  const { watch, setValue } = useFormContext<any>();

  const departmentId = watch('departmentId') ?? '';

  const { data: departments = [] } = useGetAllDepartments();
  const { data: positions = [] } = useGetPositionsByDepartment(departmentId);

  const handleEmployeeTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedType = event.target.value;

    setValue('type', selectedType);

    if (!selectedType) {
      return;
    }

    const generatedId = generateMockEmployeeId(
      selectedType.charAt(0).toUpperCase()
    );

    setValue('employeeId', generatedId);
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
            Role & Organization
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Assign the user’s department, team, and organizational role.
          </Typography>
        </Box>

        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <DataDisplayRow label="Type *">
                  <ControlledTextField
                    name="type"
                    size="small"
                    select
                    fullWidth
                    onChange={handleEmployeeTypeChange}
                  >
                    <MenuItem value="CLIENT">Client</MenuItem>
                    <MenuItem value="MANAGEMENT">Management</MenuItem>
                  </ControlledTextField>
                </DataDisplayRow>
                <DataDisplayRow label="Department *">
                  <ControlledAutocomplete
                    name="departmentId"
                    valueKey="id"
                    options={departments as Department[]}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option;
                      return option?.name ?? '';
                    }}
                    onChange={(_, newValue) => {
                      setValue(
                        'departmentId',
                        Array.isArray(newValue) ? '' : newValue?.id ?? ''
                      );
                      setValue('positionId', '');
                    }}
                  />
                </DataDisplayRow>
                <DataDisplayRow label="Position *">
                  <ControlledAutocomplete
                    name="positionId"
                    valueKey="id"
                    options={positions}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option;
                      return option?.position ?? '';
                    }}
                    disabled={!departmentId}
                    placeholder="Select position"
                  />
                </DataDisplayRow>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <DataDisplayRow label="Employee ID">
                  <ControlledTextField
                    name="employeeId"
                    size="small"
                    fullWidth
                    disabled
                  />
                </DataDisplayRow>
                <DataDisplayRow label="Status">
                  <ControlledTextField name="status" size="small" fullWidth />
                </DataDisplayRow>
                <DataDisplayRow label="Joining Date">
                  <ControlledDatePicker name="joiningDate" />
                </DataDisplayRow>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
            HMO & Coverage Setup
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Record healthcare plans, policy numbers, and dependent coverage for
            this user.
          </Typography>
        </Box>

        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="Provider">
                <ControlledTextField
                  name="hmoProvider"
                  size="small"
                  fullWidth
                />
              </DataDisplayRow>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="Account Number">
                <ControlledTextField
                  name="hmoAccountNumber"
                  size="small"
                  fullWidth
                />
              </DataDisplayRow>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="Coverage">
                <ControlledTextField
                  name="hmoCoverage"
                  size="small"
                  fullWidth
                />
              </DataDisplayRow>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="Expiry Date">
                <TextField size="small" fullWidth />
              </DataDisplayRow>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                sx={{
                  gap: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Dependents
                </Typography>
                {[].length > 0 ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{
                      flexWrap: 'wrap',
                    }}
                  >
                    {([] as any[]).map((address, index) => (
                      <Chip
                        key={
                          address.id ?? `${address.formattedAddress}-${index}`
                        }
                        label={address.formattedAddress}
                        variant="outlined"
                        color="primary"
                        onDelete={() => console.log(index)}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic' }}
                  >
                    No dependents added yet.
                  </Typography>
                )}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DataDisplayRow
                    label="First Name *"
                    config={{
                      row: {
                        flexDirection: 'column',
                        gap: 1,
                      },
                    }}
                  >
                    <ControlledTextField name="firstName" />
                  </DataDisplayRow>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DataDisplayRow
                    label="Last Name *"
                    config={{
                      row: {
                        flexDirection: 'column',
                        gap: 1,
                      },
                    }}
                  >
                    <ControlledTextField name="lastName" />
                  </DataDisplayRow>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DataDisplayRow
                    label="Account Number *"
                    config={{
                      row: {
                        flexDirection: 'column',
                        gap: 1,
                      },
                    }}
                  >
                    <ControlledTextField name="accountNumber" />
                  </DataDisplayRow>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DataDisplayRow
                    label="Coverage *"
                    config={{
                      row: {
                        flexDirection: 'column',
                        gap: 1,
                      },
                    }}
                  >
                    <ControlledTextField
                      name="coverage"
                      size="small"
                      fullWidth
                    />
                  </DataDisplayRow>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DataDisplayRow
                    label="Relationship *"
                    config={{
                      row: {
                        flexDirection: 'column',
                        gap: 1,
                      },
                    }}
                  >
                    <ControlledTextField name="relationship" />
                  </DataDisplayRow>
                </Grid>

                <Grid size={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="text"
                      color="inherit"
                      size="medium"
                      sx={{
                        minWidth: 120,
                      }}
                      // onClick={() => setFormValues(initialFormValues)}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      size="medium"
                      sx={{
                        minWidth: 120,
                      }}
                      // onClick={handleAddAddress}
                    >
                      Add Dependent
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
            Government Identifiers
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Record government-issued identifiers such as tax, social security,
            and health insurance identifiers.
          </Typography>
        </Box>

        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="SS Number">
                <ControlledTextField name="ssNumber" size="small" fullWidth />
              </DataDisplayRow>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="PhilHealth Number">
                <ControlledTextField
                  name="hmoAccountNumber"
                  size="small"
                  fullWidth
                />
              </DataDisplayRow>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="PagIBIG Number">
                <ControlledTextField
                  name="hmoCoverage"
                  size="small"
                  fullWidth
                />
              </DataDisplayRow>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DataDisplayRow label="TIN Number">
                <TextField size="small" fullWidth />
              </DataDisplayRow>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};
