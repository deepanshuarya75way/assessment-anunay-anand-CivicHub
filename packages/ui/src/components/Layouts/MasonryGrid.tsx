import React from 'react';
import { cn } from '../Skeleton';

export const MasonryGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6", className)}>
      {children}
    </div>
  );
};

export const MasonryItem = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("break-inside-avoid", className)}>
      {children}
    </div>
  );
};
