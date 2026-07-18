import React from 'react';
import { clsx } from 'clsx';
import styles from './Progress.module.css';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Progress value between 0 and 100
   */
  value?: number;
  /**
   * If true, shows an indeterminate animation
   */
  indeterminate?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, indeterminate = false, ...props }, ref) => {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clampedValue}
        className={clsx(styles.root, className)}
        {...props}
      >
        <div
          className={clsx(styles.indicator, indeterminate && styles.indeterminate)}
          style={{ transform: `translateX(-${100 - (indeterminate ? 0 : clampedValue)}%)` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';
