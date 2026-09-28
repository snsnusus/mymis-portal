import { type DepartmentFormValues } from '~/models/department.models';
import { useState, type ReactElement } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  TextField,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import DataDisplayRow from '~/components/ui/data-display-row';
import { UncontrolledUserLookup } from '~/components/modules/user-lookup';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { UserOption } from '~/models/user.models';

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
  const watchedSecondayContact = watch('secondaryContact');
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

  const handleAddMember = (member: UserOption): void => {
    addMember(member);
  };

  const handleRemoveMember = (indexToRemove: number): void => {
    removeMember(indexToRemove);
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
          Scope & Team Members
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Define the department&apos;s responsibilities and assign it&apos;s
          working team.
        </Typography>
      </Box>
      <CardContent>
        <Stack spacing={3}>
          <DataDisplayRow label="Core Responsibilities *">
            <Stack spacing={2}>
              <Stack spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g., Lead talent acquisition, Marketing Specialist..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                  fullWidth
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
                  onClick={handleAddScope}
                  disabled={isSubmitDisabled}
                  startIcon={<AddIcon />}
                >
                  Add Scope
                </Button>
              </Stack>
              {scope.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    border: '1px dashed',
                    borderColor: 'grey.300',
                  }}
                >
                  {scope.map((field, index) => (
                    <Chip
                      key={field.id}
                      variant="outlined"
                      color="primary"
                      // 1. Pass custom JSX to the label prop
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            py: 0.5,
                            pr: 0.5,
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              lineHeight: 1.2,
                              color: 'text.primary',
                              fontSize: '0.875rem',
                            }}
                          >
                            {field.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '0.775rem',
                              lineHeight: 1.1,
                              color: 'text.secondary',
                            }}
                          >
                            {field.description}
                          </Typography>
                        </Box>
                      }
                      onDelete={() => handleRemoveScope(index)}
                      sx={{
                        height: 'auto', // 2. Essential: Allows the chip to grow vertically
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        py: 0.5,
                        px: 0.5,
                        '& .MuiChip-label': {
                          whiteSpace: 'normal', // Allows long descriptions to wrap naturally
                          px: 1.5, // Adds horizontal breathing room inside the chip
                          paddingLeft: '16px', // Extra breathing room between Avatar and Text
                          paddingRight: '16px', // Extra breathing room between Text and Delete Icon
                        },
                        borderRadius: '30px',

                        // Optional: Smoothly center-align the delete icon with the larger avatar
                        '& .MuiChip-deleteIcon': {
                          marginRight: '8px',
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', pl: 1 }}
                >
                  No responsibilities added yet.
                </Typography>
              )}
            </Stack>
          </DataDisplayRow>

          <Divider />

          <DataDisplayRow label="Team Members *">
            <Stack spacing={2}>
              <UncontrolledUserLookup
                placeholder="Add team members..."
                onChange={(_, newValue) =>
                  handleAddMember(newValue as UserOption)
                }
                filterOptions={(options, state) => {
                  const inputValue = state.inputValue.toLowerCase();

                  return options.filter((user) => {
                    // 1. Match search input text
                    const matchesSearch = user.formattedName
                      .toLowerCase()
                      .includes(inputValue);

                    // 2. Exclude if already in the selected team members list
                    const isNotSelected = !watchedMembers.some(
                      (member) => member.id === user.id
                    );

                    // 3. Exclude if currently set as Primary or Secondary Contact
                    const isNotPrimaryContact =
                      user.id !== watchedPrimaryContact?.id;
                    const isNotSecondaryContact =
                      user.id !== watchedSecondayContact?.id;

                    return (
                      matchesSearch &&
                      isNotSelected &&
                      isNotPrimaryContact &&
                      isNotSecondaryContact
                    );
                  });
                }}
                renderValue={() => null}
              />
              {members.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    border: '1px dashed',
                    borderColor: 'grey.300',
                  }}
                >
                  {members.map((member, index) => (
                    <Chip
                      key={member.id}
                      variant="outlined"
                      color="primary"
                      // Pass the avatar component directly
                      avatar={
                        <Avatar
                          src={member.avatarUrl}
                          alt={member.formattedName}
                          sx={{ width: 50, height: 50 }}
                        />
                      }
                      // Render custom JSX as the label to show name & position stacked
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            py: 0.5,
                            pr: 0.5,
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              lineHeight: 1.2,
                              color: 'text.primary',
                              fontSize: '0.875rem',
                            }}
                          >
                            {member.formattedName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '0.775rem',
                              lineHeight: 1.1,
                              color: 'text.secondary',
                            }}
                          >
                            {member.position || 'No Position'}
                          </Typography>
                        </Box>
                      }
                      onDelete={() => handleRemoveMember(index)}
                      sx={{
                        height: 'auto', // Allows vertical breathing room
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        py: 0.75, // Slighly increased vertical padding for the overall chip
                        px: 0.5,
                        borderRadius: '30px',

                        // 1. Target the internal avatar class to make it bigger
                        '& .MuiChip-avatar': {
                          width: 32, // Increased from the default 24px
                          height: 32,
                          marginLeft: '8px',
                          backgroundColor: 'inherit',
                        },

                        // 2. Increase padding around the label text to space it from the avatar and delete button
                        '& .MuiChip-label': {
                          whiteSpace: 'normal',
                          paddingLeft: '16px', // Extra breathing room between Avatar and Text
                          paddingRight: '16px', // Extra breathing room between Text and Delete Icon
                        },

                        // Optional: Smoothly center-align the delete icon with the larger avatar
                        '& .MuiChip-deleteIcon': {
                          marginRight: '8px',
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic', pl: 1 }}
                >
                  No team mebers added yet.
                </Typography>
              )}
            </Stack>
          </DataDisplayRow>
        </Stack>
      </CardContent>
    </Card>
  );
};
