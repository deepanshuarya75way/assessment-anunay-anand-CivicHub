import React from 'react';
import * as PopoverPrimitives from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import { GlassSurface } from '../GlassSurface';
import styles from './Popover.module.css';

export const Popover = PopoverPrimitives.Root;
export const PopoverTrigger = PopoverPrimitives.Trigger;
export const PopoverAnchor = PopoverPrimitives.Anchor;

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitives.Content>
>(({ className, align = 'center', sideOffset = 4, children, ...props }, ref) => (
  <PopoverPrimitives.Portal>
    <PopoverPrimitives.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={clsx(styles.contentWrapper, className)}
      {...props}
    >
      <GlassSurface level={3} className={styles.content}>
        {children}
      </GlassSurface>
    </PopoverPrimitives.Content>
  </PopoverPrimitives.Portal>
));
PopoverContent.displayName = PopoverPrimitives.Content.displayName;
