import { type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const NotFound = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <SearchOffIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
          Page not found
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/')}
          sx={{
            py: 1.25,
            px: 3,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
