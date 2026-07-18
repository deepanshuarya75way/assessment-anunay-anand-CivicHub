import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, duration = 2000, className }: AnimatedNumberProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const spring = useSpring(0, { 
    bounce: 0,
    duration: duration 
  });
  
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
    setHasAnimated(true);
  }, [value, spring]);

  return <motion.span className={className}>{display}</motion.span>;
}
