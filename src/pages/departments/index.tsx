import type { DepartmentNew } from '~/models/department.models';
import { type ReactElement, useState } from 'react';
import { useGetDepartments } from '~/hooks/department.hook';
import {
  Stack,
  Grid,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Divider,
  Avatar,
} from '@mui/material';
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

import { InteractiveCard } from '~/components/ui/interactive-card';
import PreviewDialog from './preview-dialog';

const Departments = (): ReactElement => {
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentNew | null>(null);
  const [isOpenPreviewDialog, setIsOpenPreviewDialog] = useState(false);

  const { data: departmentsNew = [] } = useGetDepartments();

  console.log(departmentsNew, 'departmentsNew');

  const handleCardClick = (department: DepartmentNew): void => {
    setSelectedDepartment(department);
    setIsOpenPreviewDialog(true);
  };

  return (
    <Stack spacing={3} sx={{ py: 2 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            Departments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and view organizational business units
          </Typography>
        </Box>
      </Stack>
      <Grid container spacing={2}>
        {(departmentsNew ?? []).map((department) => (
          <Grid key={department.name} size={{ xs: 12, md: 4 }}>
            <InteractiveCard
              elevation={2}
              onClick={() => handleCardClick(department)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  sx={{ height: 130, filter: 'brightness(0.9)' }}
                  image={''}
                />
                <Chip
                  label={department.slug}
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    fontWeight: 700,
                    boxShadow: 2,
                  }}
                />
              </Box>
              <CardContent sx={{ pt: 2, pb: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  {department.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: 40,
                    mb: 2,
                  }}
                >
                  {department.description}
                </Typography>
                <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <GroupsIcon color="action" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {department.employeeCount} Members
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ alignItems: 'center' }}
                  >
                    <AccountBalanceWalletIcon fontSize="small" color="action" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        bgcolor: 'grey.100',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    >
                      Cost Center Code
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
              <Box
                sx={{
                  p: 2,
                  pt: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {department.primaryContactName ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <Avatar
                      src={undefined}
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: '0.875rem',
                      }}
                    >
                      {department.primaryContactName?.charAt(0).toUpperCase() ||
                        'U'}
                    </Avatar>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {department.primaryContactName}
                    </Typography>
                  </Stack>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: 'action.disabledBackground',
                        color: 'text.disabled',
                      }}
                    >
                      <PersonIcon sx={{ fontSize: '1rem' }} />
                    </Avatar>
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      sx={{ fontWeight: 400, fontStyle: 'italic' }}
                    >
                      Unassigned
                    </Typography>
                  </Stack>
                )}

                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                  className="view-details-text"
                >
                  View Details &rarr;
                </Typography>
              </Box>
            </InteractiveCard>
          </Grid>
        ))}
      </Grid>
      <PreviewDialog
        open={isOpenPreviewDialog}
        onClose={() => setIsOpenPreviewDialog(false)}
        selectedDepartment={selectedDepartment}
      />
    </Stack>
  );
};

export default Departments;
