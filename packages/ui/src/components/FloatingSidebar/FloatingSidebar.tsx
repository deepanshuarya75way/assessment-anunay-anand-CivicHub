import React from 'react';
import { clsx } from 'clsx';
import { GlassSurface } from '../GlassSurface';
import styles from './FloatingSidebar.module.css';

export interface FloatingSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Floating sidebar uses level 1 glass
   * @default 1
   */
  level?: 1 | 2 | 3;
}

export const FloatingSidebar = React.forwardRef<HTMLDivElement, FloatingSidebarProps>(
  ({ className, level = 1, children, ...props }, ref) => {
    return (
      <GlassSurface
        ref={ref}
        asChild
        level={level}
        className={clsx(styles.sidebar, className)}
        {...props}
      >
        <aside>
          <div className={styles.inner}>
            {children}
          </div>
        </aside>
      </GlassSurface>
    );
  }
);

FloatingSidebar.displayName = 'FloatingSidebar';
