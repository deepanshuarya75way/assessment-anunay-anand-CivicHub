import React from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import { GlassSurface } from '../GlassSurface';
import styles from './DropdownMenu.module.css';

export const DropdownMenu = DropdownMenuPrimitives.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitives.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitives.Group;
export const DropdownMenuPortal = DropdownMenuPrimitives.Portal;
export const DropdownMenuSub = DropdownMenuPrimitives.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitives.RadioGroup;

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <DropdownMenuPrimitives.Portal>
    <DropdownMenuPrimitives.Content
      ref={ref}
      sideOffset={sideOffset}
      className={clsx(styles.contentWrapper, className)}
      {...props}
    >
      <GlassSurface level={3} className={styles.content}>
        {children}
      </GlassSurface>
    </DropdownMenuPrimitives.Content>
  </DropdownMenuPrimitives.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitives.Content.displayName;

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitives.Item
    ref={ref}
    className={clsx(
      styles.item,
      inset && styles.itemInset,
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitives.Item.displayName;

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitives.CheckboxItem
    ref={ref}
    className={clsx(styles.item, styles.itemInset, className)}
    checked={checked}
    {...props}
  >
    <span className={styles.itemIndicatorWrapper}>
      <DropdownMenuPrimitives.ItemIndicator>
        <Check className={styles.icon} />
      </DropdownMenuPrimitives.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitives.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitives.CheckboxItem.displayName;

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitives.RadioItem
    ref={ref}
    className={clsx(styles.item, styles.itemInset, className)}
    {...props}
  >
    <span className={styles.itemIndicatorWrapper}>
      <DropdownMenuPrimitives.ItemIndicator>
        {/* Can use a dot or circle icon here for radio, reusing check for simplicity */}
        <Check className={styles.icon} />
      </DropdownMenuPrimitives.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitives.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitives.RadioItem.displayName;

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitives.Label
    ref={ref}
    className={clsx(
      styles.label,
      inset && styles.labelInset,
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitives.Label.displayName;

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitives.Separator
    ref={ref}
    className={clsx(styles.separator, className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitives.Separator.displayName;
