import { type ReactElement } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { ControlledTextField } from '~/components/form/inputs/controlled/textfield';
import { SectionHeader } from '~/components/section-header';
import { Card } from '~/components/ui/card';
import { SectionLabel } from '~/components/section-label';

export const HMOSetup = (): ReactElement => (
  <Card
    header={
      <SectionHeader
        header="HMO & Coverage Setup"
        subheader="Record healthcare plans, policy numbers, and dependent coverage for this
        user."
      />
    }
  >
    <Stack sx={{ gap: 2 }}>
      <Stack sx={{ gap: 1 }}>
        <SectionLabel title="Primary" />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledTextField label="Provider *" name="hMO.provider" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledTextField
              label="Account Number *"
              name="hMO.accountNumber"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <ControlledTextField label="Plan *" name="hMO.plan" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledTextField
              label="Effective Date *"
              name="hMO.effectiveDate"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ControlledTextField label="End Date *" name="hMO.endDate" />
          </Grid>
        </Grid>
      </Stack>
      <Stack sx={{ gap: 1 }}>
        <SectionLabel title="Dependents" />
        <Stack sx={{ gap: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack
                sx={{
                  gap: 2,
                }}
              >
                {[].length > 0 ? (
                  <Stack
                    spacing={1}
                    sx={{
                      flexWrap: 'wrap',
                      overflowY: 'auto',
                      maxHeight: 200,
                      scrollbarGutter: 'stable',
                      paddingRight: 1,
                    }}
                  >
                    {([] as any[]).map((dependents, index) => (
                      <Paper
                        key={dependents.id}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          width: '100%',
                        }}
                      >
                        <PersonIcon
                          color="primary"
                          fontSize="large"
                          sx={{ mt: 0.25 }}
                        />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="body2" color="text.secondary">
                            Email {index + 1}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ overflowWrap: 'anywhere' }}
                          >
                            {dependents.name}
                          </Typography>
                        </Box>
                        <Tooltip title="Remove dependent">
                          <IconButton
                            aria-label={`Remove dependent ${index + 1}`}
                            sx={{ '&:hover': { color: 'error.main' } }}
                            onClick={() => console.log(index)}
                          >
                            <DeleteIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No dependents added yet.
                  </Typography>
                )}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ControlledTextField label="First Name *" name="firstName" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ControlledTextField label="Last Name *" name="lastName" />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <ControlledTextField
                    label="Account Number *"
                    name="accountNumber"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ControlledTextField label="Coverage *" name="coverage" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ControlledTextField
                    label="Relationship *"
                    name="relationship"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Stack
            direction="row"
            sx={{
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button variant="outlined" size="small">
              Clear
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<GroupAddIcon />}
            >
              Add Dependent
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  </Card>
);
