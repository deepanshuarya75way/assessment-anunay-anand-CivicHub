import React from 'react';
import { clsx } from 'clsx';
import { GlassSurface, type GlassSurfaceProps } from '../GlassSurface';
import styles from './GlassSection.module.css';

export interface GlassSectionProps extends Omit<GlassSurfaceProps, 'level'> {
  /**
   * Sections use level 1 glass (Deep, Background)
   * @default 1
   */
  level?: 1 | 2 | 3;
}

export const GlassSection = React.forwardRef<HTMLDivElement, GlassSectionProps>(
  ({ className, level = 1, children, ...props }, ref) => {
    return (
      <GlassSurface
        ref={ref}
        asChild
        level={level}
        className={clsx(styles.section, className)}
        {...props}
      >
        <section>
          {children}
        </section>
      </GlassSurface>
    );
  }
);

GlassSection.displayName = 'GlassSection';
