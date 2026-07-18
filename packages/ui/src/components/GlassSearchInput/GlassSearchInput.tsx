import React from 'react';
import { clsx } from 'clsx';
import { Search } from 'lucide-react';
import { GlassInput, type GlassInputProps } from '../GlassInput';
import styles from './GlassSearchInput.module.css';

export interface GlassSearchInputProps extends GlassInputProps {
  /**
   * Optional custom icon to replace the default search icon
   */
  icon?: React.ReactNode;
}

export const GlassSearchInput = React.forwardRef<HTMLInputElement, GlassSearchInputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className={clsx(styles.wrapper, className)}>
        <span className={styles.iconWrapper}>
          {icon || <Search className={styles.icon} />}
        </span>
        <GlassInput
          ref={ref}
          type="search"
          className={styles.input}
          {...props}
        />
      </div>
    );
  }
);

GlassSearchInput.displayName = 'GlassSearchInput';
