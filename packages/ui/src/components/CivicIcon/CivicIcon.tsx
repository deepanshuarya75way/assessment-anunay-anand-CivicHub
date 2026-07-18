import React from 'react';
import { icons } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './CivicIcon.module.css';

export type IconName = keyof typeof icons;

export interface CivicIconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CivicIcon = React.forwardRef<SVGSVGElement, CivicIconProps>(
  ({ name, className, size = 'md', ...props }, ref) => {
    const Icon = icons[name] as React.ElementType;

    if (!Icon) {
      console.warn(`Icon ${String(name)} not found in lucide-react`);
      return null;
    }

    return (
      <Icon
        ref={ref}
        className={clsx(styles.icon, styles[`size-${size}`], className)}
        {...props}
      />
    );
  }
);

CivicIcon.displayName = 'CivicIcon';
