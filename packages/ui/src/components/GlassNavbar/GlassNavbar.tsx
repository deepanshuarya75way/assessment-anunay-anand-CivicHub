import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import styles from './GlassNavbar.module.css';

export interface GlassNavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, the navbar sticks to the top of the viewport
   * @default true
   */
  sticky?: boolean;
}

export const GlassNavbar = React.forwardRef<HTMLDivElement, GlassNavbarProps>(
  ({ className, sticky = true, children, ...props }, ref) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Run once on mount to set initial state
      handleScroll();
      
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <header
        ref={ref}
        className={clsx(
          styles.navbar,
          sticky && styles.sticky,
          scrolled && styles.scrolled,
          className
        )}
        {...props}
      >
        <div className={styles.container}>
          {children}
        </div>
      </header>
    );
  }
);

GlassNavbar.displayName = 'GlassNavbar';
