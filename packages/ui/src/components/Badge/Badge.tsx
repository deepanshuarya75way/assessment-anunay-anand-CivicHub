import React from 'react';
import { clsx } from 'clsx';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          styles.badge,
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
