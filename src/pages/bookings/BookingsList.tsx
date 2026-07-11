import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/booking.service';
import type { Booking } from '../../services/booking.service';
import eventService from '../../services/event.service';
import BookingTable from '../../components/booking/BookingTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { Alert } from '../../components/ui/Alert';
import {
  Compass,
  Filter,
  Search,
  Layers,
  AlertTriangle,
  FolderOpen,
  XCircle,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react';

const BookingsList: React.FC = () => {
  const { user } = useAuth();

  // Data loading states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Error/Success feedbacks
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    bookingService
      .getBookings()
      .then((response) => {
        if (!isMounted) return;

        if (response.success && response.data) {
          setBookings(response.data);
        } else {
          setError('Failed to fetch reservations directory.');
        }
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to fetch reservations directory.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle booking status updates (Approve, Reject, Cancel)
  const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
    setUpdatingId(id);
    setError(null);
    setSuccess(null);
    try {
      const moderatorName = user?.name || 'Moderator';
      const response = await bookingService.updateBookingStatus(id, newStatus, moderatorName);
      if (response.success && response.data) {
        const updatedBooking = response.data;
        
        // Sync in-memory list
        setBookings((prev) => prev.map((b) => (b._id === id ? updatedBooking : b)));
        setSuccess(`Booking ${id} status modified successfully to ${newStatus}.`);

        // Intelligently sync corresponding event's status!
        if (updatedBooking.eventId) {
          await eventService.updateEvent(updatedBooking.eventId, { status: newStatus });
        }
      } else {
        setError(response.message || 'Status change rejection.');
      }
    } catch (err: unknown) {
      console.error(err);
      setError('An error occurred during booking status override.');
    } finally {
      setUpdatingId(null);
    }
  };

  // useMemo filtering
  const filteredBookings = React.useMemo(() => {
    let result = bookings;

    // Search query match (bookingId, eventName, venueName)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b._id.toLowerCase().includes(term) ||
          b.eventName.toLowerCase().includes(term) ||
          b.resourceName.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter((b) => b.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    return result;
  }, [bookings, searchTerm, selectedStatus]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter criteria */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <Card className="border border-border/40 bg-card/60 backdrop-blur-md sticky top-[84px] shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <span>FILTER LEDGER</span>
                </CardTitle>
                {(searchTerm || selectedStatus !== 'all') && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] text-primary hover:underline font-semibold tracking-wide uppercase cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Search */}
              <div className="relative">
                <Input
                  label="SEARCH BY ID / EVENT"
                  placeholder="e.g. bkg-001, Hackathon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-[32px]" />
              </div>

              {/* Status checklist */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Reservation status
                </label>
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'all', label: 'All Reservations', icon: <Layers className="w-3.5 h-3.5" /> },
                    { id: 'pending', label: 'Awaiting Approvals', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> },
                    { id: 'approved', label: 'Confirmed bookings', icon: <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" /> },
                    { id: 'completed', label: 'Finished Sessions', icon: <FolderOpen className="w-3.5 h-3.5 text-blue-500" /> },
                    { id: 'cancelled', label: 'Cancelled / Rejected', icon: <XCircle className="w-3.5 h-3.5 text-red-500" /> },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStatus(s.id)}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-xs rounded-lg text-left transition-all duration-200 cursor-pointer ${
                        selectedStatus === s.id
                          ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                          : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                      }`}
                    >
                      {s.icon}
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Shortcuts */}
              <div className="border-t border-border/20 pt-4 mt-2 space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                  Console Nav Shortcuts
                </label>
                <Link to="/events" className="block w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 justify-start">
                    <Compass className="w-3.5 h-3.5 text-primary" /> Active Events Registry
                  </Button>
                </Link>
                <Link to="/resources" className="block w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 justify-start">
                    <Compass className="w-3.5 h-3.5 text-primary" /> Campus Facility Catalog
                  </Button>
                </Link>
              </div>

            </CardContent>
          </Card>
        </section>

        {/* Right Side: Table View */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Active Venue Reservation Registry</h2>
              <p className="text-xs text-muted-foreground mt-1 text-left">
                Audit conflict-free scheduling and manage reservation workflows for campus auditoriums, labs, and classrooms.
              </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-secondary/40 text-muted-foreground text-xs px-3 py-1.5 rounded-lg border border-border/20 font-medium">
                Showing <span className="font-bold text-foreground">{filteredBookings.length}</span> of {bookings.length} reservations
              </div>
            </div>
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

          {/* Moderation note */}
          {user && (user.role === 'admin' || user.role === 'organizer' || user.email === 'faculty@campusos.dev') && (
            <div className="border border-violet-500/20 bg-violet-500/5 rounded-xl p-4 text-xs flex gap-3 items-start text-violet-600 dark:text-violet-400">
              <ShieldCheck className="w-5 h-5 shrink-0 text-violet-500" />
              <div>
                <h5 className="font-bold uppercase tracking-widest text-[10px]">Moderator Access Cleared</h5>
                <p className="mt-1 leading-relaxed text-[11px] text-left">
                  You are recognized as a faculty/system coordinator. You have authorization overrides to approve or decline reservations directly in the list table below.
                </p>
              </div>
            </div>
          )}

          {/* Loader or Table */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <Spinner className="w-8 h-8 text-primary" />
              <p className="text-xs text-muted-foreground animate-pulse font-medium">
                Syncing facility bookings log...
              </p>
            </div>
          ) : (
            <BookingTable
              bookings={filteredBookings}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          )}

        </section>
    </div>
  );
};

export default BookingsList;
export { BookingsList };
