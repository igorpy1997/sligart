// frontend/frontend-app/src/components/animations/ScaleIn.js
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ScaleIn = ({ children, delay = 0, duration = 0.5, ...props }) => {
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

export default ScaleIn