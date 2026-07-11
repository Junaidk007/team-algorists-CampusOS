import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  className = '',
  ...props
}) => {
  // Color styles corresponding to Vercel/Linear color design variables
  const variantStyles = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger: 'bg-destructive/10 text-destructive dark:text-red-400 border-destructive/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    secondary: 'bg-secondary text-secondary-foreground border-border/40',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border tracking-wide uppercase select-none transition-colors duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
export { Badge };
