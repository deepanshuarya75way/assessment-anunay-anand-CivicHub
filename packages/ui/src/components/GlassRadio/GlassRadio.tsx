import React from 'react';
import * as RadioGroupPrimitives from '@radix-ui/react-radio-group';
import { clsx } from 'clsx';
import styles from './GlassRadio.module.css';

export const GlassRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitives.Root
      className={clsx(styles.radioGroup, className)}
      {...props}
      ref={ref}
    />
  );
});
GlassRadioGroup.displayName = RadioGroupPrimitives.Root.displayName;

export const GlassRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitives.Item
      ref={ref}
      className={clsx(styles.radioItem, className)}
      {...props}
    >
      <RadioGroupPrimitives.Indicator className={styles.indicator} />
    </RadioGroupPrimitives.Item>
  );
});
GlassRadioItem.displayName = RadioGroupPrimitives.Item.displayName;
