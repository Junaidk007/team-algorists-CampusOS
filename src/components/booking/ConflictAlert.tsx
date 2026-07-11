import React from 'react';
import { AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface ConflictAlertProps {
  eventName: string;
  timeSlot: string;
  onShowAlternatives?: () => void;
}

const ConflictAlert: React.FC<ConflictAlertProps> = ({ eventName, timeSlot, onShowAlternatives }) => {
  return (
    <div className="border border-amber-500/30 bg-amber-500/5 backdrop-blur-md rounded-xl p-5 text-amber-800 dark:text-amber-400 relative overflow-hidden transition-all duration-300 shadow-md animate-shake">
      
      {/* Background visual light glow */}
      <div className="absolute top-[-20%] right-[-10%] w-24 h-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0 shadow-sm border border-amber-500/25">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
        
        <div className="space-y-1 flex-1">
          <h4 className="font-bold text-sm uppercase tracking-wide text-amber-700 dark:text-amber-300">
            Venue Reservation Conflict Detected
          </h4>
          <p className="text-xs leading-relaxed opacity-90 text-left">
            The selected venue is already reserved by <strong className="text-foreground">{eventName}</strong> during the timeslot <span className="font-mono bg-amber-500/10 px-1.5 py-0.5 rounded font-bold">{timeSlot}</span>.
          </p>

          {onShowAlternatives && (
            <div className="pt-3 flex items-center gap-3">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onShowAlternatives}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-1 text-[11px] font-semibold tracking-wide uppercase py-1 px-3 shadow cursor-pointer border-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Show AI Alternatives</span>
                <ChevronRight className="w-3 h-3" />
              </Button>
              <span className="text-[10px] text-muted-foreground italic">
                * Let Gemini find available times/venues.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConflictAlert;
export { ConflictAlert };
