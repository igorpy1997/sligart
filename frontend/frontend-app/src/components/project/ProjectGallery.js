// frontend/frontend-app/src/components/project/ProjectGallery.js
// MOVE THE EXISTING CONTENT FROM THE OLD LOCATION - Same as before but with updated useEffect destructuring

import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogContent, IconButton, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ProjectGallery = ({ images, projectTitle, className }) => {
  const theme = useTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openFullscreen = (index) => {
    setSelectedImageIndex(index);
  };

  const closeFullscreen = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(prev =>
      prev > 0 ? prev - 1 : images.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev =>
      prev < images.length - 1 ? prev + 1 : 0
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const nextImage = () => {
    setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  const prevImage = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  // Handle keyboard events for fullscreen mode - DESTRUCTURED useEffect
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          closeFullscreen();
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, handlePrevImage, handleNextImage]); // PROPER DEPENDENCIES

  // Early return AFTER all hooks
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <Box className={className}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Project Gallery ({images.length} {images.length === 1 ? 'photo' : 'photos'})
        </Typography>

        {/* Main image */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <Box
            component="img"
            src={images[currentIndex]}
            alt={`${projectTitle} - Image ${currentIndex + 1}`}
            onClick={() => openFullscreen(currentIndex)}
            sx={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
          />

          {/* Fullscreen button */}
          <IconButton
            onClick={() => openFullscreen(currentIndex)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                background: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <FullscreenIcon />
          </IconButton>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={prevImage}
                sx={{
                  position: 'absolute',
                  left: 24,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    background: 'rgba(255,255,255,1)',
                  }
                }}
              >
                <ArrowBackIosIcon sx={{ ml: '4px', fontSize: '20px' }} />
              </IconButton>
              <IconButton
                onClick={nextImage}
                sx={{
                  position: 'absolute',
                  right: 24,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.9)',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    background: 'rgba(255,255,255,1)',
                  }
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: '20px' }} />
              </IconButton>
            </>
          )}
        </Box>

        {/* Thumbnails */}
        {images.length > 1 && (
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
            {images.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => goToImage(index)}
                sx={{
                  width: 100,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  opacity: index === currentIndex ? 1 : 0.6,
                  border: index === currentIndex ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                  '&:hover': {
                    opacity: 1,
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Fullscreen mode */}
      <Dialog
        open={selectedImageIndex !== null}
        onClose={closeFullscreen}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            boxShadow: 'none',
            margin: 0,
            maxHeight: '100vh',
            maxWidth: '100vw',
          }
        }}
      >
        <DialogContent sx={{
          p: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}>
          {/* Close button */}
          <IconButton
            onClick={closeFullscreen}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              zIndex: 2,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Navigation in fullscreen */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  width: 56,
                  height: 56,
                  zIndex: 2,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <ArrowBackIosIcon sx={{ ml: '3px', fontSize: '24px' }} />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  width: 56,
                  height: 56,
                  zIndex: 2,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: '24px' }} />
              </IconButton>
            </>
          )}

          {/* Image */}
          {selectedImageIndex !== null && (
            <motion.img
              key={selectedImageIndex}
              src={images[selectedImageIndex]}
              alt={`${projectTitle} - Full size ${selectedImageIndex + 1}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                maxWidth: '95vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          )}

          {/* Counter */}
          {images.length > 1 && selectedImageIndex !== null && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 30,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: theme.spacing(1, 2),
                borderRadius: '20px',
                zIndex: 2,
              }}
            >
              <Typography variant="body2">
                {selectedImageIndex + 1} / {images.length}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectGallery;