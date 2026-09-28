import { type DepartmentFormValues } from '~/models/department.models';
import type {
  BasePosition,
  PositionFormValues,
} from '~/models/position.models';
import { useState, type ChangeEvent, type ReactElement } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { DragAndDropSorter } from '~/components/ui/drag-and-drop-sorter';
import DataDisplayRow from '~/components/ui/data-display-row';
import { BaseTextField } from '~/components/form/base';
import Switch from '~/components/form/base/switch';

const initialFormState = {
  position: '',
  slug: '',
  description: '',
  isActive: true,
  isApprover: false,
};

export const Position = (): ReactElement => {
  const [formState, setFormState] = useState<BasePosition>(initialFormState);
  const { control } = useFormContext<DepartmentFormValues>();
  const { fields, replace, append, remove } = useFieldArray({
    control,
    name: 'positions',
  });

  const handleSort = (sortedItems: PositionFormValues[]): void => {
    replace(sortedItems);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, type, value } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleClear = (): void => {
    setFormState(initialFormState);
  };

  const handleAppend = (): void => {
    append({
      ...formState,
      sortOrder: fields.length + 1,
    });
    setFormState(initialFormState);
  };

  const handleRemove = (indexToRemove: number): void => {
    remove(indexToRemove);
  };

  return (
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
          Department Hierarchy & Roles
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Define key positions and set their organizational rank to manage
          reporting structures and approvals.
        </Typography>
      </Box>
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              variant="outlined"
              sx={{
                bgcolor: 'grey.25',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    Rank Order
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Drag items to change rank order
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
                <DragAndDropSorter
                  items={fields}
                  onReorder={handleSort}
                  renderItem={({ item, index }) => (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {item.position}
                          </Typography>
                          {item.isApprover && (
                            <Chip
                              icon={
                                <VerifiedUserIcon style={{ fontSize: 14 }} />
                              }
                              label="Approver"
                              size="small"
                              color="primary"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                          {!item.isActive && (
                            <Chip
                              label="Inactive"
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                        {item.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{
                              width: '100%',
                              display: 'block',
                            }}
                          >
                            {item.description}
                          </Typography>
                        )}
                      </Box>
                      <IconButton onClick={() => handleRemove(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                />
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                bgcolor: 'background.paper',
                borderRadius: 1.5,
              }}
            >
              <Stack spacing={2}>
                <DataDisplayRow label="Position *">
                  <BaseTextField
                    name="position"
                    value={formState.position}
                    onChange={handleChange}
                    placeholder="e.g. Department Head"
                  />
                </DataDisplayRow>
                <DataDisplayRow label="Slug *">
                  <BaseTextField
                    name="slug"
                    value={formState.slug}
                    onChange={handleChange}
                    placeholder="e.g. DH"
                  />
                </DataDisplayRow>
                <DataDisplayRow label="Description *">
                  <BaseTextField
                    name="description"
                    value={formState.description}
                    onChange={handleChange}
                    placeholder="Briefly describe the responsibilities..."
                    multiline
                    minRows={3}
                  />
                </DataDisplayRow>
                <Divider sx={{ my: 0.5 }} />
                <DataDisplayRow label="Role Settings">
                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{
                      alignItems: 'center',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          name="isActive"
                          checked={formState.isActive}
                          onChange={handleChange}
                          size="small"
                          color="success"
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, fontSize: '0.875rem' }}
                        >
                          Active
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          name="isApprover"
                          checked={formState.isApprover}
                          onChange={handleChange}
                          size="small"
                          color="primary"
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, fontSize: '0.875rem' }}
                        >
                          Approver
                        </Typography>
                      }
                    />
                  </Stack>
                </DataDisplayRow>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Button
                    variant="text"
                    onClick={handleClear}
                    color="inherit"
                    size="medium"
                    sx={{
                      minWidth: 120,
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleAppend}
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="medium"
                    sx={{
                      minWidth: 120,
                    }}
                  >
                    Add Position
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
