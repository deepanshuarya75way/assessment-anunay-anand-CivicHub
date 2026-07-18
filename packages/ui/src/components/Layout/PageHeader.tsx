import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  action, 
  className,
  ...props 
}: PageHeaderProps) {
  return (
    <div 
      className={clsx("flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10", className)}
      {...props}
    >
      <div className="space-y-2">
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-h1 font-bold tracking-tight text-foreground"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="text-body-lg text-muted-foreground max-w-2xl"
          >
            {description}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}
