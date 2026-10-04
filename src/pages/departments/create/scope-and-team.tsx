import { type DepartmentFormValues } from '~/models/department.model';
import { useState, type ReactElement } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  TextField,
  Avatar,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { UncontrolledUserLookup } from '~/components/modules/user-lookup';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { EmployeeOption } from '~/models/employee.model';
import { SectionLabel } from '../../../components/section-label';

export const ScopeAndTeam = (): ReactElement => {
  const { watch } = useFormContext<DepartmentFormValues>();
  const {
    fields: scope,
    append: addScope,
    remove: removeScope,
  } = useFieldArray<DepartmentFormValues, 'scopes'>({
    name: 'scopes',
  });
  const {
    fields: members,
    append: addMember,
    remove: removeMember,
  } = useFieldArray<DepartmentFormValues, 'teamMembers'>({
    name: 'teamMembers',
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const watchedPrimaryContact = watch('primaryContact');
  const watchedSecondaryContact = watch('secondaryContact');
  const watchedMembers = watch('teamMembers');

  const isSubmitDisabled = !title.trim() || !description.trim();

  const handleAddScope = (): void => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle && trimmedDescription) {
      addScope({
        title: trimmedTitle,
        description: trimmedDescription,
      });
      setTitle('');
      setDescription('');
    }
  };

  const handleRemoveScope = (indexToRemove: number): void => {
    removeScope(indexToRemove);
  };

  const handleAddMember = (member: EmployeeOption): void => {
    addMember(member);
  };

  const handleRemoveMember = (indexToRemove: number): void => {
    removeMember(indexToRemove);
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
        <Typography variant="h6">Scope & Team Members</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Define the department&apos;s responsibilities and assign it&apos;s
          working team.
        </Typography>
      </Stack>
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <SectionLabel title="Core Responsibilities" />
            <Stack spacing={1}>
              <TextField
                label="Title"
                size="small"
                placeholder="e.g., Lead talent acquisition, Marketing Specialist..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="Description"
                multiline
                size="small"
                placeholder="e.g., Oversee performance reviews, drive employee engagement..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minRows={4}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                disabled={isSubmitDisabled}
                onClick={handleAddScope}
              >
                Add Scope
              </Button>
            </Stack>
            {scope.length > 0 ? (
              <Stack
                sx={{
                  gap: 1,
                  maxHeight: 320,
                  overflowY: 'auto',
                  scrollbarGutter: 'stable',
                }}
              >
                {scope.map((field, index) => (
                  <Paper
                    key={field.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      gap: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircleIcon color="primary" />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 'fontWeightMedium' }}
                      >
                        {field.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {field.description}
                      </Typography>
                    </Box>
                    <Tooltip title="Remove responsibility">
                      <IconButton
                        size="small"
                        aria-label={`Remove ${field.title}`}
                        onClick={() => handleRemoveScope(index)}
                        sx={{ '&:hover': { color: 'error.main' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No responsibilities added yet.
              </Typography>
            )}
          </Stack>
          <Divider />
          <Stack spacing={2}>
            <SectionLabel title="Team Members" />
            <UncontrolledUserLookup
              label="Employee"
              placeholder="Select an employee to add them to the team roster..."
              onChange={(_, newValue) => {
                if (newValue) {
                  handleAddMember(newValue as EmployeeOption);
                }
              }}
              filterOptions={(options) =>
                options.filter(
                  (user) =>
                    !watchedMembers.some((member) => member.id === user.id) &&
                    user.id !== watchedPrimaryContact?.id &&
                    user.id !== watchedSecondaryContact?.id
                )
              }
              renderValue={() => null}
            />
            {members.length > 0 ? (
              <Box
                sx={{
                  maxHeight: 360,
                  overflowY: 'auto',
                  scrollbarGutter: 'stable',
                }}
              >
                <Grid container spacing={1.5}>
                  {members.map((member, index) => (
                    <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Avatar
                          alt={member.formattedName}
                          sx={{ width: 40, height: 40 }}
                        >
                          {member.formattedName.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            noWrap
                            sx={{ fontWeight: 'fontWeightMedium' }}
                          >
                            {member.formattedName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ display: 'block' }}
                          >
                            {member.position || 'No Position'}
                          </Typography>
                        </Box>
                        <Tooltip title="Remove from team">
                          <IconButton
                            size="small"
                            aria-label={`Remove ${member.formattedName}`}
                            onClick={() => handleRemoveMember(index)}
                            sx={{ '&:hover': { color: 'error.main' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No team members added yet.
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
