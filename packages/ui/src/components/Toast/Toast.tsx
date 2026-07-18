import React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { GlassSurface } from '../GlassSurface';
import { IconButton } from '../IconButton';
import styles from './Toast.module.css';

export const ToastProvider = ToastPrimitives.Provider;
export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={clsx(styles.viewport, className)}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & {
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  }
>(({ className, variant = 'default', children, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={clsx(
      styles.toast,
      styles[`variant-${variant}`],
      className
    )}
    {...props}
  >
    <GlassSurface level={3} className={styles.content}>
      <div className={styles.body}>{children}</div>
      <ToastPrimitives.Close asChild>
        <IconButton
          variant="ghost"
          className={styles.closeButton}
          aria-label="Close toast"
        >
          <X className={styles.icon} />
        </IconButton>
      </ToastPrimitives.Close>
    </GlassSurface>
  </ToastPrimitives.Root>
));
Toast.displayName = ToastPrimitives.Root.displayName;

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={clsx(styles.title, className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={clsx(styles.description, className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export const ToastAction = ToastPrimitives.Action;
