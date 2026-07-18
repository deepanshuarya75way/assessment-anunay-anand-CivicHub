import React from 'react';
import * as TooltipPrimitives from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';
import { GlassSurface } from '../GlassSurface';
import styles from './Tooltip.module.css';

export const TooltipProvider = TooltipPrimitives.Provider;
export const Tooltip = TooltipPrimitives.Root;
export const TooltipTrigger = TooltipPrimitives.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitives.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <TooltipPrimitives.Portal>
    <TooltipPrimitives.Content
      ref={ref}
      sideOffset={sideOffset}
      className={clsx(styles.contentWrapper, className)}
      {...props}
    >
      <GlassSurface level={3} className={styles.content}>
        {children}
      </GlassSurface>
    </TooltipPrimitives.Content>
  </TooltipPrimitives.Portal>
));
TooltipContent.displayName = TooltipPrimitives.Content.displayName;
