import React from 'react';
import { clsx } from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import styles from './GlassButton.module.css';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  asChild?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          styles.button,
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          loading && styles.loading,
          className
        )}
        {...props}
      >
        {loading && (
          <span className={styles.spinnerWrapper}>
            {/* Simple CSS spinner, can be replaced with Spinner component later */}
            <span className={styles.spinner} />
          </span>
        )}
        <span className={clsx(styles.content, loading && styles.contentHidden)}>
          {children}
        </span>
      </Comp>
    );
  }
);

GlassButton.displayName = 'GlassButton';
