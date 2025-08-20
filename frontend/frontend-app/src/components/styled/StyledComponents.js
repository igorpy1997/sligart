// src/components/styled/StyledComponents.js
import styled from '@emotion/styled';
import { Box, Card, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// Анимированные контейнеры
export const AnimatedContainer = styled(motion.div)`
  position: relative;
`;

export const GradientBox = styled(Box)`
  background: ${props => `linear-gradient(135deg, ${props.theme.palette.primary.main}15, ${props.theme.palette.secondary.main}15)`};
  border: ${props => `1px solid ${props.theme.palette.primary.main}30`};
  border-radius: ${props => props.theme.spacing(2)};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => `linear-gradient(135deg, ${props.theme.palette.primary.main}25, ${props.theme.palette.secondary.main}25)`};
    border-color: ${props => props.theme.palette.primary.main};
    transform: translateY(-2px);
  }
`;

// Стилизованные карточки
export const HoverCard = styled(Card)`
  transition: all 0.3s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  border: 1px solid ${props => props.theme.palette.divider};
  
  &:hover {
    transform: ${props => props.nohover ? 'none' : 'translateY(-4px)'};
    box-shadow: ${props => props.nohover ? 'none' : `0 8px 20px ${props.theme.palette.primary.main}20`};
    border-color: ${props => props.nohover ? props.theme.palette.divider : props.theme.palette.primary.main};
  }
`;

export const GlassCard = styled(Card)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }
`;

// Кнопки с эффектами
export const MagneticButton = styled(Button)`
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

export const GradientButton = styled(Button)`
  background: ${props => `linear-gradient(45deg, ${props.theme.palette.primary.main}, ${props.theme.palette.secondary.main})`};
  border: none;
  color: white;
  
  &:hover {
    background: ${props => `linear-gradient(45deg, ${props.theme.palette.primary.dark}, ${props.theme.palette.secondary.dark})`};
    transform: translateY(-1px);
  }
`;

// Типографика с эффектами
export const GradientText = styled(Typography)`
  background: ${props => `linear-gradient(45deg, ${props.theme.palette.primary.main}, ${props.theme.palette.secondary.main})`};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

export const AnimatedText = styled(Typography)`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${props => `linear-gradient(45deg, ${props.theme.palette.primary.main}, ${props.theme.palette.secondary.main})`};
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

// Контейнеры для секций
export const Section = styled(Box)`
  padding: ${props => props.theme.spacing(6, 0)};
  position: relative;
  
  ${props => props.gradient && `
    background: linear-gradient(135deg, 
      ${props.theme.palette.background.default} 0%, 
      ${props.theme.palette.primary.main}05 50%, 
      ${props.theme.palette.background.default} 100%
    );
  `}
`;

export const HeroSection = styled(Box)`
  min-height: 85vh;
  display: flex;
  align-items: center;
  position: relative;
  background: ${props => `linear-gradient(135deg, 
    ${props.theme.palette.background.default} 0%, 
    ${props.theme.palette.primary.main}08 50%, 
    ${props.theme.palette.secondary.main}05 100%
  )`};
`;

// Эффекты и анимации
export const FloatingElement = styled(motion.div)`
  position: relative;
`;

export const PulseBox = styled(Box)`
  position: relative;
`;

// Сетки и лейауты
export const MasonryGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing(3)};
  
  ${props => props.theme.breakpoints.down('md')} {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${props => props.theme.spacing(2)};
  }
`;

export const FlexCenter = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${props => props.column ? 'column' : 'row'};
  gap: ${props => props.gap ? props.theme.spacing(props.gap) : 0};
`;

// Декоративные элементы
export const DecorativeBlob = styled(Box)`
  position: absolute;
  width: ${props => props.size || '200px'};
  height: ${props => props.size || '200px'};
  background: ${props => `linear-gradient(45deg, 
    ${props.theme.palette.primary.main}20, 
    ${props.theme.palette.secondary.main}20
  )`};
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  &.blob-1 {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &.blob-2 {
    top: 60%;
    right: 10%;
    animation-delay: 2s;
  }
  
  &.blob-3 {
    bottom: 20%;
    left: 50%;
    animation-delay: 4s;
  }
`;

// Overlay и модальные окна
export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled(motion.div)`
  background: ${props => props.theme.palette.background.paper};
  border-radius: ${props => props.theme.spacing(2)};
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  position: relative;
`;

// Индикаторы загрузки
export const SkeletonBox = styled(Box)`
  background: linear-gradient(
    90deg,
    ${props => props.theme.palette.grey[200]} 25%,
    ${props => props.theme.palette.grey[100]} 50%,
    ${props => props.theme.palette.grey[200]} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: ${props => props.theme.spacing(1)};
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;