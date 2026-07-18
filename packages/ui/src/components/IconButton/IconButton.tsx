import React from 'react';
import { clsx } from 'clsx';
import { GlassButton, type GlassButtonProps } from '../GlassButton';
import styles from './IconButton.module.css';

export interface IconButtonProps extends Omit<GlassButtonProps, 'size'> {
  /**
   * Accessible label for the icon button (required)
   */
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <GlassButton
        ref={ref}
        size="icon"
        className={clsx(styles.iconButton, className)}
        {...props}
      >
        {children}
      </GlassButton>
    );
  }
);

IconButton.displayName = 'IconButton';
