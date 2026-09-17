import { type ReactElement } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const Dashboard = (): ReactElement => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      p: 2,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 6 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
        textAlign: 'center',
        maxWidth: 420,
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'grey.100',
          mb: 3,
        }}
      >
        <SearchOffIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
        Dashboard
      </Typography>
    </Paper>
  </Box>
);

export default Dashboard;
