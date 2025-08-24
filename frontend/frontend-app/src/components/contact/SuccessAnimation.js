// frontend/frontend-app/src/components/contact/SuccessAnimation.js
import React from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme } from '@mui/material';

const SuccessAnimation = () => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
          color: 'white',
          fontSize: '2rem'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          ✓
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default SuccessAnimation;