// frontend/frontend-app/src/components/developer/DeveloperHeader.js
import React from 'react';
import { Box, Container, Button, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DeveloperHeader = ({ onBack }) => {
  const theme = useTheme();

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
          sx={{ color: theme.palette.text.secondary }}
        >
          Back to Home
        </Button>
      </Container>
    </Box>
  );
};

export default DeveloperHeader;