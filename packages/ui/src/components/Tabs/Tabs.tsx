import React from 'react';
import * as TabsPrimitives from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import styles from './Tabs.module.css';

export const Tabs = TabsPrimitives.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitives.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitives.List
    ref={ref}
    className={clsx(styles.list, className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitives.List.displayName;

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitives.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitives.Trigger
    ref={ref}
    className={clsx(styles.trigger, className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitives.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitives.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitives.Content
    ref={ref}
    className={clsx(styles.content, className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitives.Content.displayName;
