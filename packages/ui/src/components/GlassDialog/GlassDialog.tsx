import React from 'react';
import * as DialogPrimitives from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { GlassSurface } from '../GlassSurface';
import { IconButton } from '../IconButton';
import styles from './GlassDialog.module.css';

export const GlassDialog = DialogPrimitives.Root;
export const GlassDialogTrigger = DialogPrimitives.Trigger;

export const GlassDialogPortal = DialogPrimitives.Portal;

export const GlassDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitives.Overlay
    ref={ref}
    className={clsx(styles.overlay, className)}
    {...props}
  />
));
GlassDialogOverlay.displayName = DialogPrimitives.Overlay.displayName;

export const GlassDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Content>
>(({ className, children, ...props }, ref) => (
  <GlassDialogPortal>
    <GlassDialogOverlay />
    <DialogPrimitives.Content
      ref={ref}
      className={clsx(styles.contentWrapper, className)}
      {...props}
    >
      <GlassSurface level={3} className={styles.content}>
        {children}
        <DialogPrimitives.Close asChild>
          <IconButton
            className={styles.closeButton}
            aria-label="Close dialog"
            variant="ghost"
          >
            <X className={styles.icon} />
          </IconButton>
        </DialogPrimitives.Close>
      </GlassSurface>
    </DialogPrimitives.Content>
  </GlassDialogPortal>
));
GlassDialogContent.displayName = DialogPrimitives.Content.displayName;

export const GlassDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.header, className)} {...props} />
);
GlassDialogHeader.displayName = 'GlassDialogHeader';

export const GlassDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.footer, className)} {...props} />
);
GlassDialogFooter.displayName = 'GlassDialogFooter';

export const GlassDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitives.Title
    ref={ref}
    className={clsx(styles.title, className)}
    {...props}
  />
));
GlassDialogTitle.displayName = DialogPrimitives.Title.displayName;

export const GlassDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitives.Description
    ref={ref}
    className={clsx(styles.description, className)}
    {...props}
  />
));
GlassDialogDescription.displayName = DialogPrimitives.Description.displayName;
