import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ChevronRight, Tag } from 'lucide-react';
import type { Event } from '../../services/event.service';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Map type to icons and styles
  const getTypeStyles = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hackathon':
        return { bg: 'bg-red-500/10 text-red-500 border-red-500/20', label: 'Hackathon' };
      case 'workshop':
        return { bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', label: 'Workshop' };
      case 'seminar':
        return { bg: 'bg-sky-500/10 text-sky-500 border-sky-500/20', label: 'Seminar' };
      case 'cultural':
        return { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', label: 'Cultural' };
      default:
        return { bg: 'bg-violet-500/10 text-violet-500 border-violet-500/20', label: 'Other Event' };
    }
  };

  // Map status to badges
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-muted/10 text-muted-foreground border border-muted/20';
    }
  };

  const typeDetails = getTypeStyles(event.type);

  return (
    <div className="group relative border border-border/40 bg-card/60 backdrop-blur-md rounded-xl p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full overflow-hidden">
      {/* Decorative Glow inside the card */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full blur-xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${typeDetails.bg}`}>
            {typeDetails.label}
          </span>
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(event.status)}`}>
            {event.status}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-bold text-base leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {event.name}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1 text-left leading-relaxed line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Metadata Details Grid */}
        <div className="space-y-2 border-t border-border/10 pt-3">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-primary/70" />
            <span className="font-medium">
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 shrink-0 text-primary/70" />
            <span>
              {event.startTime} - {event.endTime}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/70" />
            <span className="line-clamp-1 font-medium">{event.preferredVenueName}</span>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5 shrink-0 text-primary/70" />
            <span>Seats Cap: <strong className="text-foreground">{event.capacity}</strong></span>
          </div>
        </div>

        {/* Requirements tags (first 3) */}
        {event.requirements && event.requirements.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {event.requirements.slice(0, 3).map((req, idx) => (
              <span key={idx} className="inline-flex items-center gap-0.5 text-[9px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground border border-border/10 font-mono">
                <Tag className="w-2 h-2 text-muted-foreground" />
                {req}
              </span>
            ))}
            {event.requirements.length > 3 && (
              <span className="text-[9px] text-muted-foreground bg-secondary px-1 py-0.5 rounded border border-border/10 font-mono">
                +{event.requirements.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Button Link */}
      <div className="mt-5 pt-3 border-t border-border/10 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">
          Hosted by: <span className="text-foreground">{event.hostedBy}</span>
        </span>
        <Link
          to={`/events/${event._id}`}
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground transition-all duration-200"
          aria-label="View event details"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
export { EventCard };
