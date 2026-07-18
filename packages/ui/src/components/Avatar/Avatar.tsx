import React from 'react';
import * as AvatarPrimitives from '@radix-ui/react-avatar';
import { clsx } from 'clsx';
import styles from './Avatar.module.css';

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitives.Root> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    src?: string;
    alt?: string;
  }
>(({ className, size = 'md', src, alt, children, ...props }, ref) => (
  <AvatarPrimitives.Root
    ref={ref}
    className={clsx(styles.root, styles[`size-${size}`], className)}
    {...props}
  >
    {src ? (
      <>
        <AvatarPrimitives.Image src={src} alt={alt} className={styles.image} />
        <AvatarPrimitives.Fallback className={styles.fallback}>
          {alt ? alt[0]?.toUpperCase() : '?'}
        </AvatarPrimitives.Fallback>
      </>
    ) : (
      children
    )}
  </AvatarPrimitives.Root>
));
Avatar.displayName = AvatarPrimitives.Root.displayName;

export const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitives.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitives.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitives.Image
    ref={ref}
    className={clsx(styles.image, className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitives.Image.displayName;

export const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitives.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitives.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitives.Fallback
    ref={ref}
    className={clsx(styles.fallback, className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitives.Fallback.displayName;
