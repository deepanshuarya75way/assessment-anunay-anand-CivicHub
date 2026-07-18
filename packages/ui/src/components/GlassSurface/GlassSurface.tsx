import React from 'react';
import { clsx } from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import styles from './GlassSurface.module.css';

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The physics level of the glass.
   * 1: Deep (Sidebars, Backgrounds) - High opacity, low blur
   * 2: Mid (Cards, Content) - Medium opacity, medium blur
   * 3: High (Dialogs, Popovers) - Low opacity, high blur, distinct shadow
   * @default 2
   */
  level?: 1 | 2 | 3;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /**
   * Additional classes to merge.
   */
  className?: string;
  children: React.ReactNode;
}

/**
 * Base GlassSurface primitive that all other glass components extend.
 */
export const GlassSurface = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ level = 2, className, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={clsx(
          styles.surface,
          styles[`level${level}`],
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

GlassSurface.displayName = 'GlassSurface';
