import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  // Variant mapping to icons
  const icons = {
    success: <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-destructive dark:text-red-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
  };

  // Variant classes for styling
  const variantStyles = {
    success: 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-50 border-emerald-500/20',
    error: 'bg-destructive/10 text-destructive dark:text-red-100 border-destructive/20',
    warning: 'bg-amber-500/10 text-amber-950 dark:text-amber-50 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-950 dark:text-blue-50 border-blue-500/20',
  };

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border text-sm transition-all duration-200 animate-fadeIn ${variantStyles[variant]} ${className}`}
    >
      {icons[variant]}
      <div className="flex-1 flex flex-col gap-0.5">
        {title && <h5 className="font-bold tracking-tight">{title}</h5>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          aria-label="Close alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
export { Alert };
