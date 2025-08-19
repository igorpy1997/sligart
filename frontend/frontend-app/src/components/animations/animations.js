// src/components/animations/index.js
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Анимация появления снизу
export const FadeInUp = ({ children, delay = 0, duration = 0.6, ...props }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration,
        delay,
        ease: [0.175, 0.885, 0.32, 1.275], // Custom cubic-bezier
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Анимация появления слева
export const FadeInLeft = ({ children, delay = 0, duration = 0.6, ...props }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{
        duration,
        delay,
        ease: [0.175, 0.885, 0.32, 1.275],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Анимация появления справа
export const FadeInRight = ({ children, delay = 0, duration = 0.6, ...props }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{
        duration,
        delay,
        ease: [0.175, 0.885, 0.32, 1.275],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Анимация масштабирования
export const ScaleIn = ({ children, delay = 0, duration = 0.5, ...props }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{
        duration,
        delay,
        ease: [0.175, 0.885, 0.32, 1.275],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Постепенное появление списка элементов
export const StaggerContainer = ({ children, staggerDelay = 0.1, ...props }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                ease: [0.175, 0.885, 0.32, 1.275],
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Floating анимация для hero элементов
export const FloatingElement = ({ children, duration = 4, amplitude = 20, ...props }) => {
  return (
    <motion.div
      animate={{
        y: [0, -amplitude, 0],
        rotate: [0, 2, 0, -2, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Анимация печатания текста
export const TypewriterText = ({ text, delay = 0, speed = 0.05 }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + (index * speed),
            duration: 0.1,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Hover анимация для карточек
export const HoverCard = ({ children, scale = 1.05, rotate = 5, ...props }) => {
  return (
    <motion.div
      whileHover={{
        scale,
        rotateY: rotate,
        boxShadow: "0 25px 60px rgba(255, 107, 157, 0.3)",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Магнитный эффект для кнопок
export const MagneticButton = ({ children, strength = 0.3, ...props }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Параллакс эффект
export const ParallaxElement = ({ children, speed = 0.5, ...props }) => {
  const [offsetY, setOffsetY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      style={{
        transform: `translateY(${offsetY * speed}px)`,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Морфинг фонов
export const MorphingBackground = ({ children, ...props }) => {
  return (
    <motion.div
      animate={{
        background: [
          "linear-gradient(135deg, #654C52 0%, #B99099 50%, #FF6B9D 100%)",
          "linear-gradient(135deg, #4ECDC4 0%, #B39BC8 50%, #762E3F 100%)",
          "linear-gradient(135deg, #FF8A65 0%, #70444C 50%, #4ECDC4 100%)",
          "linear-gradient(135deg, #654C52 0%, #B99099 50%, #FF6B9D 100%)",
        ],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Компонент для анимации счетчиков
export const AnimatedCounter = ({ value, duration = 2, delay = 0 }) => {
  const [count, setCount] = React.useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  React.useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        const increment = value / (duration * 60); // 60 FPS
        let current = 0;
        const counter = setInterval(() => {
          current += increment;
          if (current >= value) {
            setCount(value);
            clearInterval(counter);
          } else {
            setCount(Math.floor(current));
          }
        }, 1000 / 60);

        return () => clearInterval(counter);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [inView, value, duration, delay]);

  return <span ref={ref}>{count}</span>;
};

// Экспорт всех компонентов
