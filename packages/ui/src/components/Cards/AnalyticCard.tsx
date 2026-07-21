import React from 'react';
import { cn } from '../Skeleton';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '../AnimatedNumber';

export interface AnalyticCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function AnalyticCard({
  title,
  value,
  description,
  trend,
  icon,
  className,
}: AnalyticCardProps) {
  // Extract number if value is string with formatting
  const numValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/,/g, ''));
  const isNumeric = !isNaN(numValue);

  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: 'var(--ch-shadow-lg)' }}
      className={cn("rounded-xl bg-card border shadow-sm p-6 flex flex-col transition-colors", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {isNumeric ? <AnimatedNumber value={numValue} /> : value}
        </div>
        {trend && (
          <div
            className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-error"
            )}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      {description && (
        <p className="mt-2 text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </motion.div>
  );
}
