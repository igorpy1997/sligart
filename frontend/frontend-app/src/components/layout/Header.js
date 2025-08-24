// frontend/frontend-app/src/components/layout/Header.js - WITH REDUX
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

// Redux
import {
  fetchDevelopers,
  selectDevelopers,
  selectDevelopersLoading
} from '../../store/slices/developersSlice';

import {
  toggleDrawer,
  closeDrawer,
  setHeaderScrolled,
  selectDrawerOpen,
  selectHeaderScrolled
} from '../../store/slices/uiSlice';

// Components
import Logo from '../Logo';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const developers = useSelector(selectDevelopers);
  const developersLoading = useSelector(selectDevelopersLoading);
  const drawerOpen = useSelector(selectDrawerOpen);
  const scrolled = useSelector(selectHeaderScrolled);

  // Handle scroll for transparency effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      dispatch(setHeaderScrolled(isScrolled));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  // Load developers when drawer opens
  useEffect(() => {
    if (drawerOpen && developers.length === 0) {
      dispatch(fetchDevelopers({ active_only: true, limit: 5 }));
    }
  }, [drawerOpen, developers.length, dispatch]);

  const handleDeveloperClick = (developer) => {
    dispatch(closeDrawer());
    const slug = developer.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/developer/${slug}`);
  };

  const handleToggleDrawer = () => {
    dispatch(toggleDrawer());
  };

  const handleCloseDrawer = () => {
    dispatch(closeDrawer());
  };

  return (
    <>
      {/* AppBar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AppBar
          position="fixed"
          elevation={scrolled ? 1 : 0}
          sx={{
            backgroundColor: scrolled
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease',
            zIndex: theme.zIndex.appBar,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
            {/* Menu Button */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleToggleDrawer}
              sx={{
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Logo size={40} showText={true} />
            </Link>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Spacer for fixed header */}
      <Toolbar />

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 380 },
            backgroundColor: theme.palette.primary.dark,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Our Team
            </Typography>
            <IconButton
              onClick={handleCloseDrawer}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mb: 2 }} />

          {/* Loading state */}
          {developersLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          )}

          {/* Developers list */}
          {!developersLoading && (
            <List sx={{ p: 0 }}>
              {developers.map((developer) => (
                <ListItem key={developer.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleDeveloperClick(developer)}
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={developer.avatar_url}
                        sx={{
                          bgcolor: theme.palette.secondary.main,
                          width: 48,
                          height: 48
                        }}
                      >
                        {developer.avatar_url ? null : <PersonIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500 }}>
                          {developer.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{
                            color: 'rgba(255,255,255,0.9)',
                            mb: 0.5,
                            fontWeight: 500
                          }}>
                            {developer.specialization}
                          </Typography>
                          {developer.skills && developer.skills.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {developer.skills.slice(0, 3).map((skill, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    color: 'white',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  {skill}
                                </Box>
                              ))}
                              {developer.skills.length > 3 && (
                                <Box
                                  sx={{
                                    color: 'rgba(255,255,255,0.5)',
                                    px: 1,
                                    py: 0.25,
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  +{developer.skills.length - 3} more
                                </Box>
                              )}
                            </Box>
                          )}
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {/* No developers found */}
          {!developersLoading && developers.length === 0 && (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                No team members found
              </Typography>
            </Box>
          )}

          {/* Contact info footer */}
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
              Ready to work together?
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', mt: 1 }}>
              hello@sligart.studio
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;