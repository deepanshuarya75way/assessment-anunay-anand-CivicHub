import React from 'react';
import * as SeparatorPrimitives from '@radix-ui/react-separator';
import { clsx } from 'clsx';
import styles from './Divider.module.css';

export const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitives.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitives.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={clsx(
      styles.divider,
      orientation === 'horizontal' ? styles.horizontal : styles.vertical,
      className
    )}
    {...props}
  />
));
Divider.displayName = SeparatorPrimitives.Root.displayName;
