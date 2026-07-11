import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../../services/event.service';
import type { Event } from '../../services/event.service';
import EventCard from '../../components/events/EventCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import {
  Search,
  Filter,
  Compass,
  CalendarDays,
  PlusCircle,
  AlertTriangle,
  FolderOpen,
  Award,
  Layers,
  XCircle,
} from 'lucide-react';

const EventsList: React.FC = () => {
  // Data states
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const response = await eventService.getEvents();
      if (response.success && response.data) {
        setEvents(response.data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // useMemo derived filtering
  const filteredEvents = React.useMemo(() => {
    let result = events;

    // Search query match (name, description, hostedBy, department, preferredVenueName)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term) ||
          e.hostedBy.toLowerCase().includes(term) ||
          e.department.toLowerCase().includes(term) ||
          e.preferredVenueName.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter((e) => e.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter((e) => e.type.toLowerCase() === selectedType.toLowerCase());
    }

    return result;
  }, [events, searchTerm, selectedStatus, selectedType]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedType('all');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter Panels */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <Card className="border border-border/40 bg-card/60 backdrop-blur-md sticky top-[84px] shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <span>FILTER CRITERIA</span>
                </CardTitle>
                {(searchTerm || selectedStatus !== 'all' || selectedType !== 'all') && (
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
              {/* Search input */}
              <div className="relative">
                <Input
                  label="SEARCH EVENTS"
                  placeholder="e.g. Hackathon, Robotics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-[32px]" />
              </div>

              {/* Event Type Select Filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Event Category
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                >
                  <option value="all">All Categories</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="cultural">Cultural</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Status Side Tabs */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  APPROVAL STATE
                </label>
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'all', label: 'All Lifecycle States', icon: <Layers className="w-3.5 h-3.5" /> },
                    { id: 'pending', label: 'Pending Review', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> },
                    { id: 'approved', label: 'Approved / Scheduled', icon: <Award className="w-3.5 h-3.5 text-emerald-500" /> },
                    { id: 'completed', label: 'Completed Events', icon: <FolderOpen className="w-3.5 h-3.5 text-blue-500" /> },
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

              {/* Quick Links Panel */}
              <div className="border-t border-border/20 pt-4 mt-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
                  Console Nav Shortcuts
                </label>
                <Link to="/resources">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-primary" /> View Resource Catalog
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Side: Active Events and Action Panels */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          {/* Dashboard Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">University Event Registry</h2>
              <p className="text-xs text-muted-foreground mt-1 text-left">
                Manage and audit scheduled campus activities, workshops, seminars, and organizational proposals
              </p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-secondary/40 text-muted-foreground text-xs px-3 py-1.5 rounded-lg border border-border/20 font-medium">
                Showing <span className="font-bold text-foreground">{filteredEvents.length}</span> of {events.length} events
              </div>
              <Link to="/events/create">
                <Button variant="primary" size="sm" className="gap-1.5 cursor-pointer shadow-sm">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Propose Event</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Loader State */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <Spinner className="w-8 h-8 text-primary" />
              <p className="text-xs text-muted-foreground animate-pulse font-medium">
                Fetching campus scheduling ledger...
              </p>
            </div>
          ) : filteredEvents.length > 0 ? (
            /* Events Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event._id} className="animate-fadeIn">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="border border-dashed border-border/60 rounded-xl p-16 text-center max-w-xl mx-auto flex flex-col items-center gap-4 mt-6">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <CalendarDays className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-base">No Events Match Filters</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Try adjusting search queries, changing category selection criteria, or reviewing alternate status filters.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Reset Settings
                </Button>
                <Link to="/events/create">
                  <Button variant="primary" size="sm" className="gap-1">
                    <PlusCircle className="w-3.5 h-3.5" /> Propose New Event
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
    </div>
  );
};

export default EventsList;
export { EventsList };
