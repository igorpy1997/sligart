// frontend/frontend-app/src/components/animations/AnimatedCounter.js
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const AnimatedCounter = ({ value, duration = 2, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
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

export default AnimatedCounter;