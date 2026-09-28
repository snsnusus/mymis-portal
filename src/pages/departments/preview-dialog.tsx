import type { DepartmentNew } from '~/models/department.models';
import { type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  Grid,
  Typography,
  Chip,
  Box,
  Divider,
  Avatar,
  Dialog,
  DialogContent,
  // List,
  // ListItem,
  // ListItemText,
  Paper,
  IconButton,
  Button,
  // ListItem,
  // ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
// import EmailIcon from '@mui/icons-material/Email';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDepartment: DepartmentNew | null;
}

const PreviewDialog = ({
  open,
  onClose,
  selectedDepartment,
}: PreviewDialogProps): ReactElement => {
  const navigate = useNavigate();

  const handleRedirect = (): void => {
    if (selectedDepartment?.name) {
      const { id, name } = selectedDepartment;

      navigate(`/data-management/departments/${name}/${id}`);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            height: '80vh',
            maxHeight: '80vh',
          },
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          bgcolor: 'rgba(255,255,255,0.9)',
          boxShadow: 2,
          '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Main Informational Left Panel */}
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{ height: '100%', overflowY: 'auto' }}
          >
            <Box>
              {/* Cover Image Track with Linear Gradient Shadow */}
              <Box
                sx={{
                  width: '100%',
                  height: 220,
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 100%), url(${''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'flex-end',
                  px: 4,
                  pb: 2,
                }}
              >
                {/* Text and Primary Identifier Chips Rendered Safely Inside Shadow */}
                <Box sx={{ width: '100%' }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: 'common.white', mb: 1 }}
                  >
                    {selectedDepartment?.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={selectedDepartment?.slug}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      label={'Cost Center Code'}
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: 600 }}
                    />
                    {/* {selectedDepartment?.location && (
                      <Chip
                        icon={
                          <LocationOnIcon
                            sx={{ '&&': { color: 'common.white' } }}
                          />
                        }
                        label={selectedDepartment.location}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'common.white',
                          fontWeight: 500,
                        }}
                      />
                    )} */}
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ p: 4 }}>
                {/* About Section */}
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  About Department
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6, mb: 4 }}
                >
                  {selectedDepartment?.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Core Responsibilities
                </Typography>
                <Grid container spacing={2}>
                  {[].map(({ title, description }, index) => (
                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          height: '100%',
                          bgcolor: 'background.neutral',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 4 }}>
                  <Divider sx={{ mb: 3 }} />
                  <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      disableElevation
                      color="primary"
                      startIcon={<SettingsIcon />}
                      onClick={() => handleRedirect()}
                    >
                      Manage Department
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              bgcolor: 'neutral.50',
              borderLeft: '1px solid',
              borderColor: 'divider',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Contact Points
            </Typography>

            <Stack spacing={2} sx={{ mb: 4 }}>
              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    display: 'block',
                    mb: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Primary
                </Typography>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: 'center' }}
                >
                  <Avatar src={undefined} sx={{ width: 40, height: 40 }}>
                    {selectedDepartment?.primaryContactName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedDepartment?.primaryContactName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      {selectedDepartment?.primaryContactName}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              {/* {selectedDepartment?.secondaryContact && (
                <Paper
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontWeight: 600,
                      display: 'block',
                      mb: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    Secondary Contact
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: 'center' }}
                  >
                    <Avatar
                      src={selectedDepartment.secondaryContact.avatarUrl}
                      sx={{ width: 40, height: 40 }}
                    >
                      {selectedDepartment.secondaryContact.formattedName.charAt(
                        0
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedDepartment.secondaryContact.formattedName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        {selectedDepartment.secondaryContact.position}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )} */}
            </Stack>
            <Stack
              direction="row"
              sx={{
                mb: 1.5,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Team Members
              </Typography>
            </Stack>
            {/* <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
              <List disablePadding>
                {(selectedDepartment?.teamMembers ?? []).map((member) => (
                  <ListItem
                    key={member.id}
                    disablePadding
                    sx={{
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{ p: 1.5, width: '100%', alignItems: 'center' }}
                      spacing={1.5}
                    >
                      <Avatar
                        src={member.avatarUrl}
                        sx={{ width: 36, height: 36, fontSize: '0.875rem' }}
                      >
                        {member.formattedName.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={member.formattedName}
                        secondary={member.position}
                        slotProps={{
                          primary: {
                            variant: 'body2',
                            sx: {
                              fontWeight: 600,
                              maxWidth: '80%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            },
                          },
                          secondary: { variant: 'caption' },
                        }}
                      />
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </Box> */}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
