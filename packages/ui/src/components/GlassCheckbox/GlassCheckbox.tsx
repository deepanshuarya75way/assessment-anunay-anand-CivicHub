import React from 'react';
import * as CheckboxPrimitives from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './GlassCheckbox.module.css';

export const GlassCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitives.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitives.Root
    ref={ref}
    className={clsx(styles.checkbox, className)}
    {...props}
  >
    <CheckboxPrimitives.Indicator className={clsx(styles.indicator)}>
      <Check className={styles.icon} />
    </CheckboxPrimitives.Indicator>
  </CheckboxPrimitives.Root>
));

GlassCheckbox.displayName = CheckboxPrimitives.Root.displayName;
