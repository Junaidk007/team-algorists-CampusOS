import React from 'react';
import RecommendationCard from './RecommendationCard';
import type { BookingRecommendation } from './RecommendationCard';

interface RecommendationPanelProps {
  recommendations: BookingRecommendation[];
  onSelect: (recommendation: BookingRecommendation) => void;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ recommendations, onSelect }) => (
  <section className="rounded-xl border border-violet-500/25 bg-violet-500/5 p-5 shadow-sm animate-fadeIn">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
        Recommendation assistant
      </p>
      <h3 className="mt-1 text-base font-bold">Choose an alternative schedule</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        These suggestions are advisory. CampusOS checks availability again before saving your event.
      </p>
    </div>

    <div className="mt-4 grid gap-3 md:grid-cols-3">
      {recommendations.map((recommendation) => (
        <RecommendationCard key={recommendation.id} recommendation={recommendation} onSelect={onSelect} />
      ))}
    </div>
  </section>
);

export default RecommendationPanel;