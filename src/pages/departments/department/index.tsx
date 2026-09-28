import { type ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Paper,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import HubIcon from '@mui/icons-material/Hub';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Tab from '~/components/tab';

interface RosterMember {
  id: string;
  name: string;
  email: string;
  position: string;
  avatarUrl: string;
  roleType: 'Head' | 'Lead' | 'Member';
  employmentType: 'Permanent' | 'Contract';
}

const Department = (): ReactElement => {
  const { name, id } = useParams<{ name: string; id: string }>();

  const [department] = useState({
    name: id,
    code: name?.toUpperCase() || 'ENG',
    costCenter: 'CC-1024',
    location: 'Manila Office (Hybrid)',
    businessUnit: 'Core Technology & Platforms',
    description:
      'Responsible for client tool modernization, data pipelines, internal calculators, and infrastructure performance updates.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    responsibilities: [
      {
        title: 'Infrastructure Management',
        desc: 'Cloud platforms, container networks, deployment pipeline scaling, and system uptime checks.',
      },
      {
        title: 'Application Development',
        desc: 'Building custom client tools, web portals, and system component modernizations.',
      },
      {
        title: 'Data Synchronization',
        desc: 'Maintaining real-time calculations and updates across downstream business models.',
      },
    ],
    // 1. Unified Roster containing all members with explicit operational assignments
    roster: [
      {
        id: 'm1',
        name: 'Heman',
        email: 'heman@company.com',
        position: 'Director of Engineering',
        roleType: 'Head',
        employmentType: 'Permanent',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=heman',
      },
      {
        id: 'm2',
        name: 'Nick',
        email: 'nick@company.com',
        position: 'Lead Frontend Engineer',
        roleType: 'Lead',
        employmentType: 'Permanent',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nick',
      },
      {
        id: 'm3',
        name: 'Jason',
        email: 'jason@company.com',
        position: 'Senior Frontend Developer',
        roleType: 'Member',
        employmentType: 'Permanent',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jason',
      },
      {
        id: 'm4',
        name: 'Issy',
        email: 'issy@company.com',
        position: 'UI/UX Designer',
        roleType: 'Member',
        employmentType: 'Permanent',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=issy',
      },
      {
        id: 'm5',
        name: 'Glenn',
        email: 'glenn@company.com',
        position: 'Fullstack Engineer',
        roleType: 'Member',
        employmentType: 'Contract',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=glenn',
      },
    ] as RosterMember[],
  });

  const sortedRoster = [...department.roster].sort((a, b) => {
    const weights = { Head: 1, Lead: 2, Member: 3 };
    return weights[a.roleType] - weights[b.roleType];
  });

  return (
    <Box sx={{ py: 2, maxWidth: '1600px', mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 2,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '180px',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `url(${department.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
          }}
        />

        <Stack
          sx={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { md: 'center' },
            gap: 2,
          }}
        >
          <Box>
            <Stack
              sx={{ flexDirection: 'row', gap: 1.5, alignItems: 'center' }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {department.name} ({department.code})
              </Typography>
              <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                maxWidth: '700px',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {department.description}
            </Typography>
          </Box>
          <Stack
            sx={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Chip
              icon={<LocationOnIcon style={{ color: '#fff' }} />}
              label={department.location}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.4)',
                bgcolor: 'rgba(255,255,255,0.15)',
              }}
              variant="outlined"
            />
            <Chip
              icon={<HubIcon style={{ color: '#fff' }} />}
              label={department.businessUnit}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.4)',
                bgcolor: 'rgba(255,255,255,0.15)',
              }}
              variant="outlined"
            />
          </Stack>
        </Stack>
      </Paper>

      <Tab
        tabs={[
          {
            label: 'Overview',
            content: <h1>OVERVIEW</h1>,
          },
          {
            label: 'Personnel & Staff',
            content: <h1>Personnel & Staff</h1>,
          },
          {
            label: 'Org Chart',
            content: <h1>ORG CHART</h1>,
          },
        ]}
      />
      {/* CORE TWO-COLUMN LAYOUT */}
      <Grid container spacing={2}>
        {/* LEFT PANEL: Core Roster (Now housing leadership + members) */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <Box
              sx={{
                px: 3,
                pt: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Personnel & Staffing
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Unified corporate directory roster including leadership
                  designations.
                </Typography>
              </Box>
              <Button
                variant="contained"
                disableElevation
                startIcon={<PersonAddIcon />}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Add Personnel
              </Button>
            </Box>

            <CardContent sx={{ px: 1 }}>
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {sortedRoster.map((member) => {
                  const isLeadership =
                    member.roleType === 'Head' || member.roleType === 'Lead';

                  return (
                    <ListItem
                      key={member.id}
                      secondaryAction={
                        <Stack sx={{ flexDirection: 'row', gap: 0.5 }}>
                          <Tooltip title="Email Profile">
                            <IconButton
                              size="small"
                              href={`mailto:${member.email}`}
                            >
                              <EmailIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modify Assignment">
                            <IconButton size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Offboard">
                            <IconButton size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      }
                      sx={{
                        mx: 2,
                        width: 'calc(100% - 32px)',
                        borderRadius: 2,
                        border: isLeadership
                          ? '1px solid'
                          : '1px solid transparent',
                        borderColor:
                          member.roleType === 'Head'
                            ? 'primary.light'
                            : 'divider',
                        bgcolor:
                          member.roleType === 'Head'
                            ? 'primary.initial'
                            : 'background.paper',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={member.avatarUrl}
                          sx={{
                            border: isLeadership ? '2px solid' : 'none',
                            borderColor: 'primary.main',
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack
                            sx={{
                              flexDirection: 'row',
                              gap: 1,
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {member.name}
                            </Typography>
                            {member.roleType === 'Head' && (
                              <Chip
                                label="Dept Head"
                                size="small"
                                color="primary"
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                }}
                              />
                            )}
                            {member.roleType === 'Lead' && (
                              <Chip
                                label="Team Lead"
                                size="small"
                                color="secondary"
                                sx={{
                                  height: 18,
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                }}
                              />
                            )}
                            {member.employmentType === 'Contract' && (
                              <Chip
                                label="Contractor"
                                size="small"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.65rem' }}
                              />
                            )}
                          </Stack>
                        }
                        secondary={member.position}
                        slotProps={{
                          secondary: { sx: { variant: 'caption', mt: 0.25 } },
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT PANEL: Scope and Cost Accounting Core */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack sx={{ gap: 2 }}>
            {/* Financial & Compliance Guardrails */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    mb: 2,
                  }}
                >
                  Corporate Accounting Ledger
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: 'background.neutral',
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 0.5 }}
                      >
                        Cost Center Node
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 700, fontFamily: 'monospace' }}
                      >
                        {department.costCenter}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        bgcolor: 'background.neutral',
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 0.5 }}
                      >
                        Headcount Budget Status
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 700, color: 'success.main' }}
                      >
                        Approved
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Scope Assignments */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <Box
                sx={{
                  px: 3,
                  pt: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Operational Mandate
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Functional scopes managed by this business unit.
                  </Typography>
                </Box>
                <IconButton size="small" color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack sx={{ gap: 2 }}>
                  {department.responsibilities.map((item, idx) => (
                    <Paper
                      key={idx}
                      variant="outlined"
                      sx={{
                        p: 2,
                        position: 'relative',
                        '&:hover .del-scope': { opacity: 1 },
                      }}
                    >
                      <Stack
                        sx={{
                          flexDirection: 'row',
                          gap: 1,
                          alignItems: 'center',
                          mb: 0.5,
                        }}
                      >
                        <AssignmentIndIcon fontSize="inherit" color="action" />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700 }}
                        >
                          {item.title}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}
                      >
                        {item.desc}
                      </Typography>
                      <IconButton
                        className="del-scope"
                        size="small"
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          opacity: 0,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Department;
