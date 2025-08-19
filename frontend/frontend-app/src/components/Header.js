import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import Logo from './Logo';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  // Handle scroll for transparency effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load developers from API
  useEffect(() => {
    const loadDevelopers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/public/developers?active_only=true&limit=10');
        if (response.ok) {
          const data = await response.json();
          setDevelopers(data);
        } else {
          console.error('Failed to load developers');
        }
      } catch (error) {
        console.error('Error loading developers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (drawerOpen && developers.length === 0) {
      loadDevelopers();
    }
  }, [drawerOpen, developers.length]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleDeveloperClick = (developer) => {
    setDrawerOpen(false);
    navigate(`/developer/${developer.id}`);
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
          position="sticky"
          elevation={scrolled ? 1 : 0}
          sx={{
            backgroundColor: scrolled
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${theme.palette.divider}`,
            transition: 'all 0.3s ease',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
            {/* Menu Button */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
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
            <Logo size={40} showText={true} />
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
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
              onClick={toggleDrawer(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mb: 2 }} />

          {/* Loading state */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          )}

          {/* Developers list */}
          {!loading && (
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
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 0.5, fontWeight: 500 }}>
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
          {!loading && developers.length === 0 && (
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