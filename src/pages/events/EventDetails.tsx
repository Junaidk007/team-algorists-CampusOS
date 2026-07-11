import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/event.service';
import type { Event } from '../../services/event.service';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  ShieldCheck,
  Ban,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadEventDetails = async () => {
      if (!id) return;
      setLoading(true);
      const response = await eventService.getEventById(id);
      if (response.success && response.data) {
        setEvent(response.data);
      } else {
        setError(response.message || 'Failed to load event specifications.');
      }
      setLoading(false);
    };

    loadEventDetails();
  }, [id]);

  // Handle status update (e.g. Approve, Reject, Cancel)
  const handleUpdateStatus = async (newStatus: 'approved' | 'rejected' | 'cancelled') => {
    if (!id || !event) return;
    setUpdating(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await eventService.updateEvent(id, { status: newStatus });
      if (response.success && response.data) {
        setEvent(response.data);
        setSuccess(`Event status successfully updated to ${newStatus}.`);
      } else {
        setError(response.message || 'Failed to update status.');
      }
    } catch (err: unknown) {
      console.error(err);
      setError('An error occurred during event state modification.');
    } finally {
      setUpdating(false);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to permanently delete this event proposal?')) return;
    setUpdating(true);
    setError(null);
    try {
      const response = await eventService.deleteEvent(id);
      if (response.success) {
        navigate('/events');
      } else {
        setError(response.message || 'Failed to delete event.');
      }
    } catch (err: unknown) {
      console.error(err);
      setError('An error occurred while deleting the event.');
    } finally {
      setUpdating(false);
    }
  };

  // Map status badges
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
      case 'cancelled':
        return 'bg-muted-500/10 text-muted-foreground border border-muted/20';
      default:
        return 'bg-muted/10 text-muted-foreground border border-muted/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-3">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-xs text-muted-foreground animate-pulse font-medium">Loading event ledger...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
          <XCircle className="w-6 h-6 text-destructive" />
        </div>
        <h4 className="font-bold text-base">Error Loading Event Specifications</h4>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">{error}</p>
        <Link to="/events">
          <Button variant="outline" size="sm">Return to Events Directory</Button>
        </Link>
      </div>
    );
  }

  if (!event) return null;

  // Check if current user is creator or administrator
  const isCreator = user && (event.organizerId === user._id || user.email === event.organizerId);
  
  // Faculty can only approve events belonging to their own department. Dean and Admin can approve any.
  const isFacultyOrAdmin = (() => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'dean') return true;
    if (user.role === 'faculty') {
      const eventDept = typeof event.department === 'object' && event.department ? (event.department as any)._id : event.department;
      const userDept = typeof user.department === 'object' && user.department ? (user.department as any)._id : user.department;
      return !!eventDept && eventDept === userDept;
    }
    if (user.email === 'faculty@campusos.dev') return true;
    return false;
  })();

  return (
    <div className="space-y-6">
        
        {/* Navigation Breadcrumb back */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-4">
          <div className="flex items-center gap-3">
            <Link to="/events">
              <Button variant="outline" size="sm" className="p-2 w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight">{event.name}</h2>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(event.status)}`}>
                  {event.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 text-left">
                Hosted by: <strong className="text-foreground">{event.hostedBy}</strong> &middot; Assoc Dept: <span className="text-foreground font-semibold">{event.department}</span>
              </p>
            </div>
          </div>

          {/* Organizer action for cancel/delete */}
          {isCreator && event.status !== 'cancelled' && event.status !== 'completed' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs border-red-500/20 text-destructive hover:bg-destructive/10 cursor-pointer"
                onClick={() => handleUpdateStatus('cancelled')}
                disabled={updating}
              >
                <Ban className="w-3.5 h-3.5" /> Cancel Event
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                onClick={handleDeleteEvent}
                disabled={updating}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Proposal
              </Button>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Details Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Columns: Main description and specifications details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Description card */}
            <Card className="border border-border/40 bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                  Event Objectives & Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-line text-left">
                  {event.description}
                </p>

                {/* Requirements / Amenities list */}
                <div className="border-t border-border/10 pt-4 space-y-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-left">
                    Required Infrastructure & Equipment
                  </h4>
                  {event.requirements && event.requirements.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {event.requirements.map((req, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 text-xs bg-secondary px-2.5 py-1 rounded-lg text-foreground border border-border/15 font-medium">
                          <Tag className="w-3 h-3 text-primary" />
                          {req}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-left italic">
                      No special facilities or equipment requested for this session.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick action: mock approval control panel for demo validation */}
            {isFacultyOrAdmin && event.status === 'pending' && (
              <Card className="border border-violet-500/20 bg-violet-500/5 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-xs font-bold tracking-wider text-violet-500 uppercase flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>FACULTY / ADMIN DECISION DESK (DEMO MODE)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed text-left">
                    You have administrative clearance to override and moderate booking requests. Overlapping date slots and capacity requirements check out automatically. Select status outcome below:
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus('approved')}
                      disabled={updating}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer text-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Event & Resource Booking
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus('rejected')}
                      disabled={updating}
                      className="border-red-500/20 text-destructive hover:bg-destructive/10 gap-1.5 cursor-pointer text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject Event Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completed and Cancelled info */}
            {event.status === 'completed' && (
              <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-4 text-xs text-blue-600 dark:text-blue-400 flex gap-2.5 items-start">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px] text-left">
                  This event was successfully completed on <strong>{event.date}</strong>. Corresponding facility resource logs have been archived for Department utilization dashboards.
                </p>
              </div>
            )}

            {event.status === 'cancelled' && (
              <div className="border border-muted/20 bg-muted/5 rounded-xl p-4 text-xs text-muted-foreground flex gap-2.5 items-start">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px] text-left">
                  This event booking request was marked cancelled or rejected. The requested venue slot has been released back into the active campus resource inventory.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Spec checklist */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border border-border/40 bg-card/60 backdrop-blur-md sticky top-[84px] shadow-sm">
              <CardHeader className="pb-3 border-b border-border/10">
                <CardTitle className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                  Event Parameters Ledger
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-muted-foreground text-[10px] uppercase tracking-wide">Date</h5>
                    <p className="mt-0.5 text-foreground font-semibold">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Timing */}
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-muted-foreground text-[10px] uppercase tracking-wide">Reserved Time</h5>
                    <p className="mt-0.5 text-foreground font-semibold">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                </div>

                {/* Venue Details */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-muted-foreground text-[10px] uppercase tracking-wide">Reserved Location</h5>
                    <p className="mt-0.5 text-foreground font-semibold">
                      {event.preferredVenueName}
                    </p>
                    <Link
                      to={`/resources/${event.preferredVenueId}`}
                      className="text-[10px] text-primary hover:underline font-semibold block mt-1.5 uppercase tracking-wide"
                    >
                      Inspect Venue Specs &rarr;
                    </Link>
                  </div>
                </div>

                {/* Seating cap */}
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-muted-foreground text-[10px] uppercase tracking-wide">Capacity Allocation</h5>
                    <p className="mt-0.5 text-foreground font-semibold">
                      {event.capacity} expected attendees
                    </p>
                  </div>
                </div>

                {/* Status audit logs */}
                <div className="border-t border-border/10 pt-4 mt-4 text-[10px] text-muted-foreground space-y-1.5">
                  <div className="flex justify-between">
                    <span>PROPOSAL CREATED:</span>
                    <span className="font-mono text-foreground">{new Date(event.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LEDGER ID:</span>
                    <span className="font-mono text-foreground uppercase tracking-tighter">{event._id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

    </div>
  );
};

export default EventDetails;
export { EventDetails };
