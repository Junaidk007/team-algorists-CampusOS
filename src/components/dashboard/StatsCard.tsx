import React from 'react';
import Card from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className = '',
}) => {
  return (
    <Card className={`border border-border/40 bg-card/60 backdrop-blur-md hover:border-primary/20 hover:shadow-md transition-all duration-300 group overflow-hidden relative ${className}`}>
      
      {/* Background glow hover interaction */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/2 blur-2xl group-hover:bg-primary/5 transition-all duration-300 pointer-events-none" />

      <div className="p-6 flex flex-col justify-between h-full relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
              {title}
            </span>
            <h4 className="text-3xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {value}
            </h4>
          </div>
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 border border-border/20 transition-all duration-300 shrink-0">
              {icon}
            </div>
          )}
        </div>

        {/* Lower row: description and trend */}
        {(description || trend) && (
          <div className="mt-4 pt-3 border-t border-border/10 flex items-center justify-between text-xs text-muted-foreground">
            {description && <p className="truncate mr-2 font-medium">{description}</p>}
            {trend && (
              <span
                className={`shrink-0 font-semibold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase ${
                  trend.isPositive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                {trend.value} {trend.label}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;
export { StatsCard };
