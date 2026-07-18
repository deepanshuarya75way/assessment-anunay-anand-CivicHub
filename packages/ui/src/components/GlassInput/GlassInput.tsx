import React from 'react';
import { clsx } from 'clsx';
import styles from './GlassInput.module.css';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          styles.input,
          error && styles.error,
          className
        )}
        {...props}
      />
    );
  }
);

GlassInput.displayName = 'GlassInput';
