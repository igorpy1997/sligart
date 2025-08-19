import React, { useState } from 'react';
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
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  // Моковые данные разработчиков (потом будем получать из API)
  const developers = [
    {
      id: 1,
      name: 'Игорь Слизгарт',
      role: 'Full-Stack Developer',
      avatar: null, // Пока без аватара
      skills: ['React', 'Python', 'FastAPI']
    },
    {
      id: 2,
      name: 'Анна Кодкинс',
      role: 'Frontend Developer',
      avatar: null,
      skills: ['React', 'TypeScript', 'UI/UX']
    },
    {
      id: 3,
      name: 'Макс Бэкендов',
      role: 'Backend Developer',
      avatar: null,
      skills: ['Python', 'PostgreSQL', 'Docker']
    }
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleDeveloperClick = (developer) => {
    console.log('Clicked developer:', developer);
    setDrawerOpen(false);
    // Тут будет навигация к профилю разработчика
  };

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          {/* Логотип */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                S
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Sligart Studio
            </Typography>
          </Box>

          {/* Бургер меню */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer с разработчиками */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 360 },
            backgroundColor: theme.palette.primary.dark,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Заголовок drawer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Наша команда
            </Typography>
            <IconButton
              onClick={toggleDrawer(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mb: 2 }} />

          {/* Список разработчиков */}
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
                      src={developer.avatar}
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        width: 48,
                        height: 48
                      }}
                    >
                      {developer.avatar ? null : <PersonIcon />}
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
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                          {developer.role}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {developer.skills.slice(0, 3).map((skill, index) => (
                            <Box
                              key={index}
                              sx={{
                                backgroundColor: theme.palette.secondary.main,
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
                        </Box>
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Контактная информация в футере drawer */}
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
              Готовы к сотрудничеству?
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