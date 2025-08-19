import React from 'react';
import { Box, Typography } from '@mui/material';

const Logo = ({
  size = 40,
  showText = true,
  textVariant = 'h6',
  logoPath = '/logo.png' // You can put your logo file in public folder
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        component="img"
        src={logoPath}
        alt="Sligart Studio Logo"
        sx={{
          width: size,
          height: size,
          mr: showText ? 2 : 0,
          borderRadius: 2,
          // Fallback styles if image fails to load
          backgroundColor: 'primary.main',
          objectFit: 'contain'
        }}
        onError={(e) => {
          // Fallback to text logo if image fails
          e.target.style.display = 'none';
          e.target.nextElementSibling.style.display = 'flex';
        }}
      />

      {/* Fallback text logo */}
      <Box
        sx={{
          width: size,
          height: size,
          backgroundColor: 'primary.main',
          borderRadius: 2,
          display: 'none', // Hidden by default, shown if image fails
          alignItems: 'center',
          justifyContent: 'center',
          mr: showText ? 2 : 0
        }}
      >
        <Typography
          variant={textVariant}
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: size * 0.4
          }}
        >
          S
        </Typography>
      </Box>

      {showText && (
        <Typography
          variant={textVariant}
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          Sligart Studio
        </Typography>
      )}
    </Box>
  );
};

export default Logo;