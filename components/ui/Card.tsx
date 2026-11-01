import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sand' | 'sage' | 'lavender' | 'outlined';
}

export function Card({
  children,
  className,
  variant = 'default',
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white/80 border border-sand-200 shadow-soft',
    sand: 'bg-sand-50 border border-sand-300 shadow-soft',
    sage: 'bg-sage-50/70 border border-sage-200 shadow-soft',
    lavender: 'bg-lavender-50/60 border border-lavender-200 shadow-soft',
    outlined: 'bg-transparent border border-sand-300',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl p-6 transition-all duration-200',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge(clsx('flex items-start justify-between mb-4', className))}>
      <div>
        <h3 className="font-editorial text-xl font-medium text-forest">{title}</h3>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
