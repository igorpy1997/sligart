// frontend/frontend-app/src/components/FloatingContactButton.js
import React, { useState, useEffect } from 'react';
import { Fab, Tooltip, useTheme, GlobalStyles } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ContactForm from './ContactForm';

const FloatingContactButton = () => {
  const theme = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  // Встроенные стили для анимации
  const animationStyles = (
    <GlobalStyles
      styles={{
        '@keyframes pulse-dot': {
          '0%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '50%': {
            transform: 'scale(1.3)',
            opacity: 0.7,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1,
          }
        },
        '.floating-fab': {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '12px',
            height: '12px',
            backgroundColor: '#ff4444',
            borderRadius: '50%',
            border: '2px solid white',
            zIndex: 1,
            animation: 'pulse-dot 2s infinite',
          }
        }
      }}
    />
  );

  // Показываем кнопку после небольшой задержки
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // Появляется через 2 секунды после загрузки

    return () => clearTimeout(timer);
  }, []);

  // Останавливаем пульсацию через некоторое время
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 10000); // Пульсирует 10 секунд

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Возобновляем пульсацию при наведении
  const handleMouseEnter = () => {
    setIsPulsing(true);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 3000);
  };

  const handleClick = () => {
    setIsFormOpen(true);
    setIsPulsing(false);
  };

  return (
    <>
      {animationStyles}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.5
            }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
          >
            <Tooltip
              title="💬 Let's Talk!"
              placement="left"
              arrow
              PopperProps={{
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: theme.palette.grey[800],
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    padding: '8px 12px',
                    borderRadius: '8px'
                  },
                  '& .MuiTooltip-arrow': {
                    color: theme.palette.grey[800],
                  }
                }
              }}
            >
              <motion.div
                animate={isPulsing ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    `0 4px 20px ${theme.palette.primary.main}40`,
                    `0 8px 30px ${theme.palette.primary.main}60`,
                    `0 4px 20px ${theme.palette.primary.main}40`
                  ]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: isPulsing ? Infinity : 0,
                  ease: "easeInOut"
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Fab
                  color="primary"
                  size="large"
                  onClick={handleClick}
                  className={isPulsing ? 'floating-fab' : ''}
                  sx={{
                    width: 64,
                    height: 64,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                    border: 'none',
                    outline: 'none',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      boxShadow: `0 12px 35px ${theme.palette.primary.main}50`,
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                      transform: 'translateY(0px)',
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: isPulsing ? [0, 15, -15, 0] : 0,
                      scale: isPulsing ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: isPulsing ? Infinity : 0,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  >
                    <QuestionAnswerIcon sx={{ fontSize: 28, color: 'white' }} />
                  </motion.div>
                </Fab>
              </motion.div>
            </Tooltip>

            {/* Дополнительные анимированные кольца для привлечения внимания */}
            {isPulsing && (
              <>
                <motion.div
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    border: `2px solid ${theme.palette.primary.main}`,
                    pointerEvents: 'none',
                    zIndex: -1
                  }}
                />
                <motion.div
                  animate={{
                    scale: [1, 2.5, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    border: `2px solid ${theme.palette.secondary.main}`,
                    pointerEvents: 'none',
                    zIndex: -1
                  }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ContactForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  );
};

export default FloatingContactButton;