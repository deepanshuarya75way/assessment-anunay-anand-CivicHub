import React from 'react';
import { clsx } from 'clsx';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface';
import styles from './GlassPanel.module.css';

export interface GlassPanelProps extends Omit<GlassSurfaceProps, 'level'> {
  /**
   * Panels typically use level 1 glass (Deep, Background)
   * @default 1
   */
  level?: 1 | 2 | 3;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, level = 1, children, ...props }, ref) => {
    return (
      <GlassSurface
        ref={ref}
        level={level}
        className={clsx(styles.panel, className)}
        {...props}
      >
        {children}
      </GlassSurface>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';
