import React from 'react';
import { clsx } from 'clsx';
import { GlassButton, type GlassButtonProps } from '../GlassButton';
import styles from './FloatingActionButton.module.css';

export interface FloatingActionButtonProps extends Omit<GlassButtonProps, 'size'> {
  /**
   * Accessible label for the FAB (required)
   */
  'aria-label': string;
  size?: 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, size = 'lg', position = 'bottom-right', children, ...props }, ref) => {
    return (
      <GlassButton
        ref={ref}
        size={size === 'lg' ? 'lg' : 'md'}
        className={clsx(
          styles.fab,
          styles[`position-${position}`],
          styles[`size-${size}`],
          className
        )}
        {...props}
      >
        {children}
      </GlassButton>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';
