import React from 'react';
import { clsx } from 'clsx';

export interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /**
   * Defines the width constraint
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg' | 'full';
  /**
   * Adds standard vertical padding
   * @default true
   */
  padded?: boolean;
}

export function SectionContainer({ 
  children, 
  size = 'default',
  padded = true,
  className,
  ...props 
}: SectionContainerProps) {
  return (
    <section 
      className={clsx(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        padded && "py-12 md:py-16 lg:py-24",
        {
          'max-w-3xl': size === 'sm',
          'max-w-7xl': size === 'default',
          'max-w-[1440px]': size === 'lg',
          'max-w-none': size === 'full'
        },
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
