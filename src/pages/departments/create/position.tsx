import { type DepartmentFormValues } from '~/models/department.model';
import type {
  BasePosition,
  PositionFormValues,
} from '~/models/position.models';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactElement,
} from 'react';
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
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { DragAndDropSorter } from '~/components/ui/drag-and-drop-sorter';
import { DataDisplayRow } from '~/components/ui/data-display-row';
import { BaseTextField } from '~/components/form/inputs/base/textfield';
import { Switch } from '~/components/form/inputs/base/switch';
import { SectionLabel } from '~/components/section-label';

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

  const listRef = useRef<HTMLDivElement>(null);
  const previousCount = useRef(fields.length);

  useEffect(() => {
    if (fields.length > previousCount.current) {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    previousCount.current = fields.length;
  }, [fields.length]);

  const normalizedSlug = formState.slug.trim().toUpperCase();
  const isDuplicateSlug =
    normalizedSlug !== '' &&
    fields.some((field) => field.slug.trim().toUpperCase() === normalizedSlug);
  const canAdd =
    formState.position.trim() !== '' &&
    normalizedSlug !== '' &&
    formState.description.trim() !== '' &&
    !isDuplicateSlug;

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
      <Stack
        sx={{
          p: 2,
          flexWrap: 'wrap',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Department Hierarchy & Roles</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Define key positions and set their organizational rank to manage
          reporting structures and approvals.
        </Typography>
      </Stack>
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              variant="outlined"
              sx={{
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  p: (theme) => theme.spacing(2, 2, 0, 2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <SectionLabel
                  title="Rank Order"
                  caption="Drag items to change rank order"
                />
                <Chip
                  variant="filled"
                  color="primary"
                  label={`${fields.length} ${
                    fields.length === 1 ? 'position' : 'positions'
                  }`}
                  sx={{
                    typography: 'body1',
                    textTransform: 'uppercase',
                    height: 'auto',
                    py: 0.5,
                  }}
                />
              </Box>
              <Box
                ref={listRef}
                sx={{
                  p: 2,
                  flexGrow: 1,
                  maxHeight: 278,
                  overflowY: 'auto',
                  scrollbarGutter: 'stable',
                }}
              >
                <DragAndDropSorter
                  items={fields}
                  onReorder={handleSort}
                  renderItem={({
                    item: { position, description, isApprover, isActive },
                    index,
                  }) => (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        minWidth: 0,
                      }}
                    >
                      <Stack
                        sx={{
                          gap: 2,
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Stack>
                          <Typography>{position}</Typography>
                          {description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {description}
                            </Typography>
                          )}
                        </Stack>
                        <Stack
                          sx={{
                            flexDirection: 'row',
                            gap: 1,
                            alignItems: 'center',
                          }}
                        >
                          {isApprover && (
                            <Chip
                              icon={<VerifiedUserIcon fontSize="small" />}
                              label="Approver"
                              color="primary"
                            />
                          )}
                          {!isActive && (
                            <Chip
                              icon={<VerifiedUserIcon fontSize="small" />}
                              label="Inactive"
                              color="error"
                            />
                          )}
                        </Stack>
                      </Stack>
                      <Tooltip title="Remove position">
                        <IconButton
                          aria-label={`Remove ${position}`}
                          onClick={() => handleRemove(index)}
                          sx={{ '&:hover': { color: 'error.main' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
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
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                bgcolor: 'background.paper',
                borderRadius: 1.5,
              }}
            >
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid size={{ sm: 12, md: 6 }}>
                    <BaseTextField
                      label="Position *"
                      name="position"
                      value={formState.position}
                      onChange={handleChange}
                      placeholder="e.g. Department Head"
                    />
                  </Grid>
                  <Grid size={{ sm: 12, md: 6 }}>
                    <BaseTextField
                      label="Slug *"
                      name="slug"
                      value={formState.slug}
                      onChange={handleChange}
                      placeholder="e.g. DH"
                      error={isDuplicateSlug}
                      helperText={
                        isDuplicateSlug
                          ? 'Already used by another position.'
                          : undefined
                      }
                    />
                  </Grid>
                  <Grid size={{ sm: 12, md: 12 }}>
                    <BaseTextField
                      label="Description *"
                      name="description"
                      value={formState.description}
                      onChange={handleChange}
                      placeholder="Briefly describe the responsibilities..."
                      multiline
                      minRows={3}
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 0.5 }} />
                <DataDisplayRow label="Role Settings">
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        gap: 2,
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
                            sx={{
                              paddingLeft: 1.5,
                            }}
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
                            sx={{
                              paddingLeft: 1.5,
                            }}
                          >
                            Approver
                          </Typography>
                        }
                      />
                    </Stack>
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
                    variant="outlined"
                    onClick={handleClear}
                    color="inherit"
                    size="medium"
                    sx={{
                      minWidth: 150,
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAppend}
                    disabled={!canAdd}
                    sx={{
                      minWidth: 150,
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
