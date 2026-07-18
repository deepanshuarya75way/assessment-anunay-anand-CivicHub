import React from 'react';
import { clsx } from 'clsx';
import styles from './GlassTextarea.module.css';

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          styles.textarea,
          error && styles.error,
          className
        )}
        {...props}
      />
    );
  }
);

GlassTextarea.displayName = 'GlassTextarea';
