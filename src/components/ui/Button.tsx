import React from 'react';
import Spinner from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes with premium design tokens
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] hover:-translate-y-0.5';

  // Variant mappings using Vercel/Linear color scheme variables
  const variantStyles = {
    primary: 'bg-gradient-to-br from-primary via-violet-500 to-fuchsia-500 text-primary-foreground shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 focus:ring-ring',
    secondary: 'bg-secondary/70 backdrop-blur-sm text-secondary-foreground hover:bg-secondary focus:ring-ring border border-border/50',
    outline: 'bg-transparent text-foreground border border-border hover:bg-accent hover:text-accent-foreground focus:ring-ring',
    danger: 'bg-destructive text-destructive-foreground hover:bg-opacity-90 focus:ring-destructive',
    ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-accent',
  };

  // Size mappings
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Spinner className="w-4 h-4 text-current" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
export { Button };
