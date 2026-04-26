import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, label, error, helperText, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-label-md text-on-surface dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          'flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-on-surface transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white',
          error && 'border-error focus:border-error focus:ring-error/20',
          className
        )}
        ref={ref}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn('text-sm', error ? 'text-error' : 'text-slate-500')}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
