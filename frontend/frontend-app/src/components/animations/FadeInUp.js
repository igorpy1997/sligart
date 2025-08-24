// frontend/frontend-app/src/components/animations/FadeInUp.js
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FadeInUp = ({ children, delay = 0, duration = 0.6, ...props }) => {
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
        ease: [0.175, 0.885, 0.32, 1.275],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeInUp;