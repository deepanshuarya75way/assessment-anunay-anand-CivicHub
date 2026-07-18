import React from 'react';
import * as SelectPrimitives from '@radix-ui/react-select';
import { ChevronDown, Check, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './GlassSelect.module.css';

export const GlassSelect = SelectPrimitives.Root;

export const GlassSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitives.Trigger
    ref={ref}
    className={clsx(styles.trigger, className)}
    {...props}
  >
    {children}
    <SelectPrimitives.Icon asChild>
      <ChevronDown className={styles.icon} />
    </SelectPrimitives.Icon>
  </SelectPrimitives.Trigger>
));
GlassSelectTrigger.displayName = SelectPrimitives.Trigger.displayName;

export const GlassSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitives.Portal>
    <SelectPrimitives.Content
      ref={ref}
      className={clsx(styles.content, className)}
      position={position}
      {...props}
    >
      <SelectPrimitives.ScrollUpButton className={styles.scrollButton}>
        <ChevronUp className={styles.icon} />
      </SelectPrimitives.ScrollUpButton>
      <SelectPrimitives.Viewport className={styles.viewport}>
        {children}
      </SelectPrimitives.Viewport>
      <SelectPrimitives.ScrollDownButton className={styles.scrollButton}>
        <ChevronDown className={styles.icon} />
      </SelectPrimitives.ScrollDownButton>
    </SelectPrimitives.Content>
  </SelectPrimitives.Portal>
));
GlassSelectContent.displayName = SelectPrimitives.Content.displayName;

export const GlassSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitives.Item
    ref={ref}
    className={clsx(styles.item, className)}
    {...props}
  >
    <span className={styles.itemIndicatorWrapper}>
      <SelectPrimitives.ItemIndicator>
        <Check className={styles.icon} />
      </SelectPrimitives.ItemIndicator>
    </span>
    <SelectPrimitives.ItemText>{children}</SelectPrimitives.ItemText>
  </SelectPrimitives.Item>
));
GlassSelectItem.displayName = SelectPrimitives.Item.displayName;

export const GlassSelectValue = SelectPrimitives.Value;
export const GlassSelectGroup = SelectPrimitives.Group;
export const GlassSelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitives.Label
    ref={ref}
    className={clsx(styles.label, className)}
    {...props}
  />
));
GlassSelectLabel.displayName = SelectPrimitives.Label.displayName;
export const GlassSelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitives.Separator
    ref={ref}
    className={clsx(styles.separator, className)}
    {...props}
  />
));
GlassSelectSeparator.displayName = SelectPrimitives.Separator.displayName;
