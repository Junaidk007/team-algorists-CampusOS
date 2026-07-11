import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, type = 'text', disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Base input styling
    const baseInputStyles = 'w-full px-3 py-2 text-sm rounded-lg bg-background text-foreground border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 disabled:bg-muted';
    
    // Border state coloring
    const borderStyles = error
      ? 'border-destructive focus:ring-destructive'
      : 'border-border/60 focus:ring-ring focus:border-transparent';

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-muted-foreground select-none"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={`${baseInputStyles} ${borderStyles} ${className}`}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-destructive font-medium animate-fadeIn">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
export { Input };
