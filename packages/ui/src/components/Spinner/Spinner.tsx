import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import styles from './Spinner.module.css';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        className={clsx(styles.spinner, styles[`size-${size}`], className)}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';
