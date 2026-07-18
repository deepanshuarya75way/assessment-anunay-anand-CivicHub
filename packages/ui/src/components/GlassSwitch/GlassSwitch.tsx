import React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { clsx } from 'clsx';
import styles from './GlassSwitch.module.css';

export const GlassSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={clsx(styles.switch, className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={styles.thumb} />
  </SwitchPrimitives.Root>
));

GlassSwitch.displayName = SwitchPrimitives.Root.displayName;
