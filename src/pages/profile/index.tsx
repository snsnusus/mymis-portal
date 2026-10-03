import { type ReactElement } from 'react';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { useProfileStore } from '~/stores/profile';
import { useAuth } from '~/contexts/auth.context';

import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { FormProvider } from '~/components/form/form-provider';
import Tab from '~/components/tab';

import { Contact, Domain, Government, Personal } from './tabs';

import { shallow } from 'zustand/shallow';

interface User {
  firstname: string;
  middlename: string;
  lastname: string;
  suffix?: string;
  nickname?: string;
  gender: string;
  birthdate: Date;
  birthplace: string;
  nationality: string;
  maritalStatus: string;
  religion?: string;
}

const Profile = (): ReactElement => {
  const { user: currentUser } = useAuth();

  const form = useForm<User>({
    defaultValues: {
      firstname: 'Pea Daphne',
      middlename: 'Valencerina',
      lastname: 'Vargas',
      nickname: 'Pey',
      gender: 'Female',
      birthdate: new Date('02/20/1998'),
      birthplace: 'Bulacan',
      nationality: 'Filipino',
      maritalStatus: 'Single',
      religion: 'Iglesia Ni Cristo',
    },
  });

  const { setCanEdit } = useProfileStore(
    (state) => ({
      setCanEdit: state.setCanEdit,
    }),
    shallow
  );

  const handleSubmit: SubmitHandler<User> = (data) => {
    console.log(data);

    setCanEdit(false);
  };

  return (
    <FormProvider<User> {...form} onSubmit={handleSubmit}>
      <Stack
        spacing={1.5}
        sx={{
          py: 2,
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: {
                xs: 2,
                md: 3,
              },
              alignItems: { xs: 'initial', md: '' },
            }}
          >
            <Avatar
              variant="circular"
              sx={{
                width: { xs: 75, md: 100 },
                height: { xs: 75, md: 100 },
              }}
            />
            <Stack
              sx={{
                gap: { xs: 0.5, md: 0.5 },
              }}
            >
              <Stack
                direction={{ xs: 'row', md: 'row' }}
                sx={{
                  alignItems: { xs: 'initial', md: 'initial' },
                  gap: { xs: 0.5, md: 0.5 },
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      flexShrink: 0,
                      fontSize: (theme) => ({
                        xs: theme.typography.body2.fontSize,
                        md: theme.typography.body1.fontSize,
                      }),
                      fontWeight: 'fontWeightBold',
                    }}
                  >
                    {currentUser?.name}
                  </Typography>
                  <CheckCircleIcon
                    color="secondary"
                    sx={{
                      fontSize: {
                        xs: '1.25rem',
                        md: '1.5rem',
                      },
                    }}
                  />
                </Box>
                <Typography
                  variant="body1"
                  color="#979797de"
                  sx={{
                    flexShrink: 0,
                    fontSize: (theme) => ({
                      xs: theme.typography.body2.fontSize,
                      md: theme.typography.body1.fontSize,
                    }),
                    fontWeight: 'fontWeightBold',
                  }}
                >
                  M-20-457
                </Typography>
              </Stack>
              <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                sx={{
                  gap: { xs: 0.5, md: 1 },
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="body1"
                  sx={(theme) => ({
                    flexShrink: 0,
                    // 1. Set your base responsive sizes using standard tokens
                    fontSize: {
                      xs: theme.typography.body2.fontSize,
                      md: theme.typography.body2.fontSize,
                    },

                    // 2. Safely apply the intermediate squeeze-zone override
                    // [theme.breakpoints.between(900, 960)]: {
                    //   fontSize: '0.875rem',
                    // },
                  })}
                >
                  Senior Specialist
                </Typography>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    display: { xs: 'none', sm: 'none', md: 'initial' },
                    flexShrink: 0,
                    border: '1px solid',
                    color: 'divider',
                  }}
                />
                <Typography
                  variant="body1"
                  color="#979797de"
                  sx={{
                    flexShrink: 0,
                    fontSize: (theme) => ({
                      xs: theme.typography.body2.fontSize,
                      md: theme.typography.body2.fontSize,
                    }),
                  }}
                >
                  Information Technology
                </Typography>
              </Stack>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                  gap: { xs: 0.5, md: 1 },
                  alignItems: 'center',
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  <AlternateEmailIcon
                    sx={{
                      color: '#979797de',
                      // ⚡ Overrides the default size responsively using pixel values
                      fontSize: {
                        xs: '0.875rem', // Smaller on mobile (approx 20px)
                        md: '1rem', // Medium on laptop/desktop (approx 24px)
                      },
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="#979797de"
                    sx={{
                      fontSize: (theme) => ({
                        xs: theme.typography.body2.fontSize,
                        md: theme.typography.body2.fontSize,
                      }),
                    }}
                  >
                    peyvargas@sourcefit.net
                  </Typography>
                </Stack>
                <FiberManualRecordIcon
                  sx={{
                    fontSize: '0.5rem', // Shrinks it down to a perfect crisp bullet size
                    color: '#979797de',
                    flexShrink: 0, // Stops the bullet from squishing on multi-line wraps
                  }}
                />
                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  <CallIcon
                    sx={{
                      color: '#979797de',
                      // ⚡ Overrides the default size responsively using pixel values
                      fontSize: {
                        xs: '0.875rem', // Smaller on mobile (approx 20px)
                        md: '1rem', // Medium on laptop/desktop (approx 24px)
                      },
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="#979797de"
                    sx={{
                      fontSize: (theme) => ({
                        xs: theme.typography.body2.fontSize,
                        md: theme.typography.body2.fontSize,
                      }),
                      flexShrink: 0,
                    }}
                  >
                    (+63) 936 544 9043
                  </Typography>
                </Stack>
              </Stack>
              <Stack
                sx={{
                  gap: 0.5,
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    gap: 0.5,
                    alignItems: 'center',
                  }}
                >
                  <AvatarGroup max={5} total={11} sx={{ alignItems: 'center' }}>
                    <Tooltip title="Ralph Bondoc" placement="top" arrow>
                      <Avatar
                        alt="Ralph Bondoc"
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=Ralph"
                      />
                    </Tooltip>
                    <Tooltip title="Jazztine Barredo" placement="top" arrow>
                      <Avatar
                        alt="Jazztine Barredo"
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=Jazztine"
                      />
                    </Tooltip>

                    <Tooltip title="Ria Marie Toledo" placement="top" arrow>
                      <Avatar
                        alt="Ria Marie Toledo"
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=Ria"
                      />
                    </Tooltip>
                    <Tooltip title="Xie Picazo" placement="top" arrow>
                      <Avatar
                        alt="Xie Picazo"
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=Xie"
                      />
                    </Tooltip>
                  </AvatarGroup>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Tab
          tabs={[
            {
              label: 'Personal',
              content: <Personal />,
            },
            {
              label: 'Contact',
              content: <Contact />,
            },
            {
              label: 'Domain',
              content: <Domain />,
            },
            {
              label: 'Government',
              content: <Government />,
            },
          ]}
        />
      </Stack>
    </FormProvider>
  );
};

export default Profile;
