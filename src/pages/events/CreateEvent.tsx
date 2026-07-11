import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import eventService from '../../services/event.service';
import bookingService from '../../services/booking.service';
import EventForm from '../../components/events/EventForm';
import ConflictAlert from '../../components/booking/ConflictAlert';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { ArrowLeft } from 'lucide-react';
import type { BookingRecommendation } from '../../components/booking/RecommendationCard';

type EventSubmission = {
  name: string;
  type: string;
  description: string;
  hostedBy: string;
  department: string;
  capacity: number;
  date: string;
  startTime: string;
  endTime: string;
  preferredVenueId: string;
  preferredVenueName: string;
  requirements: string[];
};

const shiftDate = (date: string, days: number) => {
  const [year, month, day] = date.split('-').map(Number);
  const result = new Date(year, month - 1, day + days);
  return result.toISOString().slice(0, 10);
};

const createFallbackRecommendations = (eventData: EventSubmission): BookingRecommendation[] => [
  {
    id: 'next-day',
    priority: 1,
    venueId: eventData.preferredVenueId,
    venueName: eventData.preferredVenueName,
    date: shiftDate(eventData.date, 1),
    startTime: eventData.startTime,
    endTime: eventData.endTime,
    reason: 'Keep the same venue and move the event to the following day.',
  },
  {
    id: 'later-slot',
    priority: 2,
    venueId: eventData.preferredVenueId,
    venueName: eventData.preferredVenueName,
    date: shiftDate(eventData.date, 1),
    startTime: '18:00',
    endTime: '20:00',
    reason: 'Use an evening slot on the following day for greater schedule separation.',
  },
  {
    id: 'two-days-later',
    priority: 3,
    venueId: eventData.preferredVenueId,
    venueName: eventData.preferredVenueName,
    date: shiftDate(eventData.date, 2),
    startTime: eventData.startTime,
    endTime: eventData.endTime,
    reason: 'Preserve the requested time while moving the booking two days later.',
  },
];

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<{ eventName: string; timeSlot: string } | null>(null);
  const [recommendations, setRecommendations] = useState<BookingRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleSubmit = async (eventData: EventSubmission) => {
    setIsLoading(true);
    setError(null);
    setConflict(null);
    setRecommendations([]);
    setShowRecommendations(false);
    try {
      const conflictResponse = await bookingService.checkConflicts(
        eventData.preferredVenueId,
        eventData.date,
        eventData.startTime,
        eventData.endTime,
      );

      if (conflictResponse.success && conflictResponse.data.conflict) {
        setConflict({
          eventName: conflictResponse.data.eventName ?? 'another event',
          timeSlot: conflictResponse.data.timeSlot ?? `${eventData.startTime} - ${eventData.endTime}`,
        });
        setRecommendations(createFallbackRecommendations(eventData));
        return;
      }

      if (!conflictResponse.success) {
        setError(conflictResponse.message || 'Unable to check venue availability.');
        return;
      }

      const response = await eventService.createEvent(eventData);
      if (response.success) {
        // Redirect to events log
        navigate('/events');
      } else {
        setError(response.message || 'Failed to submit event proposal.');
      }
    } catch (err: unknown) {
      console.error(err);
      setError('An error occurred during event scheduling. Check logs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        
        {/* Navigation Breadcrumb back */}
        <div className="flex items-center justify-between border-b border-border/10 pb-4">
          <div className="flex items-center gap-3">
            <Link to="/events">
              <Button variant="outline" size="sm" className="p-2 w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Propose New Event</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fill details below to reserve campus venues and submit for administrative routing.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="error" className="max-w-2xl mx-auto" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {conflict && (
          <ConflictAlert
            eventName={conflict.eventName}
            timeSlot={conflict.timeSlot}
            onShowAlternatives={() => setShowRecommendations(true)}
          />
        )}

        <div className="py-2">
          <EventForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            recommendations={recommendations}
            showRecommendations={showRecommendations}
            onRecommendationApplied={() => {
              setConflict(null);
              setRecommendations([]);
              setShowRecommendations(false);
            }}
          />
        </div>

    </div>
  );
};

export default CreateEvent;
export { CreateEvent };
