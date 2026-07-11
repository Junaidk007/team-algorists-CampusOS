import React from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface BookingRecommendation {
  id: string;
  priority: number;
  venueId: string;
  venueName: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

interface RecommendationCardProps {
  recommendation: BookingRecommendation;
  onSelect: (recommendation: BookingRecommendation) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onSelect }) => (
  <article className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
          Choice {recommendation.priority}
        </p>
        <h4 className="mt-1 text-sm font-bold">{recommendation.venueName}</h4>
      </div>
      <Sparkles className="h-4 w-4 shrink-0 text-violet-500" />
    </div>

    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
      <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{recommendation.venueName}</p>
      <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{recommendation.date}</p>
      <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{recommendation.startTime} – {recommendation.endTime}</p>
    </div>

    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{recommendation.reason}</p>
    <Button className="mt-4 w-full" size="sm" onClick={() => onSelect(recommendation)}>
      Use this suggestion
    </Button>
  </article>
);

export default RecommendationCard;