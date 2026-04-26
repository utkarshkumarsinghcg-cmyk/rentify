import React from 'react';
import { cn } from '../../utils/cn';
const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-label-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-fixed-dim shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-on-secondary hover:bg-secondary-fixed-dim',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'text-slate-600 hover:text-blue-600 hover:bg-slate-100',
    danger: 'bg-error text-on-error hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
