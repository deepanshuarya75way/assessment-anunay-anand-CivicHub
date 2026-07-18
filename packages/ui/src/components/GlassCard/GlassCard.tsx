import React from 'react';
import { clsx } from 'clsx';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface';
import styles from './GlassCard.module.css';

export interface GlassCardProps extends Omit<GlassSurfaceProps, 'level'> {
  /**
   * Optional padding variant
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * If true, adds a subtle hover effect
   * @default false
   */
  interactive?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, padding = 'md', interactive = false, children, ...props }, ref) => {
    return (
      <GlassSurface
        ref={ref}
        level={2}
        className={clsx(
          styles.card,
          styles[`padding-${padding}`],
          interactive && styles.interactive,
          className
        )}
        {...props}
      >
        {children}
      </GlassSurface>
    );
  }
);

GlassCard.displayName = 'GlassCard';
