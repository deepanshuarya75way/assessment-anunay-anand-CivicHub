import React from 'react';
import { clsx } from 'clsx';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface PageShellProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  /** Whether to add top padding for the fixed navbar */
  withNav?: boolean;
}

export function PageShell({ 
  children, 
  withNav = true, 
  className, 
  ...props 
}: PageShellProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "min-h-screen w-full flex flex-col bg-background text-foreground",
        withNav && "pt-[72px]", // Height of GlassNavbar
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
