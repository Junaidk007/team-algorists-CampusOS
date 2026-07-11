
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import resourceService from '../../services/resource.service';
import type { Resource } from '../../services/resource.service';
import departmentService from '../../services/department.service';
import type { Department } from '../../services/department.service';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import RecommendationPanel from '../booking/RecommendationPanel';
import type { BookingRecommendation } from '../booking/RecommendationCard';
import { Calendar, Award, ShieldAlert, Cpu, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface EventFormProps {
  onSubmit: (data: {
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
  }) => void;
  isLoading: boolean;
  recommendations?: BookingRecommendation[];
  showRecommendations?: boolean;
  onRecommendationApplied?: () => void;
}

const AMENITIES_POOL = [
  'Projector',
  'Sound System',
  'Microphones',
  'AC',
  'RTX Workstations',
  'High-Speed LAN',
  'Whiteboard',
  'Interactive Smartboard',
  '3D Printers',
  'Robotic Arms',
];

const EventForm: React.FC<EventFormProps> = ({ onSubmit, isLoading, recommendations = [], showRecommendations = false, onRecommendationApplied }) => {
  const navigate = useNavigate();

  // Wizard Steps
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('workshop');
  const [description, setDescription] = useState('');
  const [hostedBy, setHostedBy] = useState(() => {
    const storedUser = localStorage.getItem('campusos-user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return parsed.name || '';
      } catch {
        return '';
      }
    }
    return '';
  });
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [capacity, setCapacity] = useState<number>(50);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [preferredVenueId, setPreferredVenueId] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);

  // Resource list state
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);

  // Error/Alerts states
  const [error, setError] = useState<string | null>(null);

  // Load resources and departments for selection
  useEffect(() => {
    const loadData = async () => {
      setLoadingResources(true);
      setLoadingDepts(true);
      try {
        const [resResponse, deptResponse] = await Promise.all([
          resourceService.getResources(),
          departmentService.getDepartments()
        ]);
        
        if (resResponse.success && resResponse.data) {
          setResources(resResponse.data);
        }
        if (deptResponse.success && deptResponse.data) {
          setDepartments(deptResponse.data);
          if (deptResponse.data.length > 0) {
            setDepartment(deptResponse.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching resources or departments:', err);
      } finally {
        setLoadingResources(false);
        setLoadingDepts(false);
      }
    };
    loadData();
  }, []);

  // Selected Venue item
  const selectedVenue = resources.find((r) => r._id === preferredVenueId);

  // Conflict Checks & Smart Capacity Warnings
  const capacityWarning = selectedVenue && capacity > selectedVenue.capacity;
  
  // Requirement warning: check if selected venue lacks any selected requirements
  const getMissingAmenities = () => {
    if (!selectedVenue || !selectedVenue.amenities) return [];
    
    // Normalize venue amenities for matching
    const venueAmenitiesLower = selectedVenue.amenities.map(a => a.toLowerCase());
    
    return requirements.filter(req => {
      const match = venueAmenitiesLower.some(v => v.includes(req.toLowerCase()) || req.toLowerCase().includes(v));
      return !match;
    });
  };
  const missingAmenities = getMissingAmenities();

  const handleRecommendationSelect = (recommendation: BookingRecommendation) => {
    setDate(recommendation.date);
    setStartTime(recommendation.startTime);
    setEndTime(recommendation.endTime);
    setPreferredVenueId(recommendation.venueId);
    setCurrentStep(3);
    setError(null);
    onRecommendationApplied?.();
  };

  // Requirements Selection Handler
  const handleToggleRequirement = (amenity: string) => {
    if (requirements.includes(amenity)) {
      setRequirements(requirements.filter((r) => r !== amenity));
    } else {
      setRequirements([...requirements, amenity]);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!name.trim()) return 'Event name is required.';
    if (!hostedBy.trim()) return 'Host organizer is required.';
    if (!description.trim()) return 'Event description is required.';
    return null;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!date) return 'Event date is required.';
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) {
      return 'Event date cannot be in the past.';
    }

    if (!startTime) return 'Start time is required.';
    if (!endTime) return 'End time is required.';
    if (startTime >= endTime) {
      return 'Start time must be strictly before End time.';
    }

    if (capacity <= 0) return 'Expected capacity must be greater than zero.';
    return null;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (!preferredVenueId) return 'Please choose a preferred campus venue.';
    return null;
  };

  // Step navigation
  const handleNextStep = () => {
    setError(null);
    let stepError = null;

    if (currentStep === 1) stepError = validateStep1();
    else if (currentStep === 2) stepError = validateStep2();

    if (stepError) {
      setError(stepError);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep((prev) => prev - 1);
  };

  // Final Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const step3Error = validateStep3();
    if (step3Error) {
      setError(step3Error);
      return;
    }

    if (!selectedVenue) {
      setError('Selected venue details could not be found.');
      return;
    }

    onSubmit({
      name,
      type,
      description,
      hostedBy,
      department,
      capacity,
      date,
      startTime,
      endTime,
      preferredVenueId,
      preferredVenueName: selectedVenue.name,
      requirements,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto border border-border/40 bg-card/60 backdrop-blur-md rounded-xl shadow-xl p-6 relative overflow-hidden transition-all">
      
      {/* Wizard Step Progress Tracker */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[
          { label: 'Core Specs', step: 1 },
          { label: 'Timing & Seats', step: 2 },
          { label: 'Venue & Tags', step: 3 },
        ].map((s) => (
          <div key={s.step} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= s.step
                  ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {currentStep > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                currentStep >= s.step ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {s.label}
            </span>
            {s.step < 3 && <div className="w-8 sm:w-16 h-[1px] bg-border/40 mx-2" />}
          </div>
        ))}
      </div>

      {error && (
        <Alert variant="error" className="mb-5" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {showRecommendations && recommendations.length > 0 && (
        <div className="mb-5">
          <RecommendationPanel recommendations={recommendations} onSelect={handleRecommendationSelect} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Core details */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <Input
              label="EVENT TITLE"
              placeholder="e.g. Campus Robotics Hackathon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Event Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="cultural">Cultural Event</option>
                  <option value="other">Other / Special Session</option>
                </select>
              </div>

              <Input
                label="HOST ORGANIZER (CLUB / DEPT)"
                placeholder="e.g. TechNeekX Coding Club"
                value={hostedBy}
                onChange={(e) => setHostedBy(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                DEPARTMENT ASSOC
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={isLoading || loadingDepts}
                className="w-full px-3 py-2 text-xs rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
              >
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                EVENT SPECIFICATIONS / DESCRIPTION
              </label>
              <textarea
                placeholder="Detail what this event accomplishes, scheduled timelines, prerequisites, and registration notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={4}
                className="w-full px-3 py-2 text-xs rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all resize-none"
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Date & Capacity settings */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                EVENT DATE
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Calendar className="w-4 h-4 text-muted-foreground absolute right-3 top-[32px] pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="START TIME"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isLoading}
                required
              />
              <Input
                label="END TIME"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span>EXPECTED ATTENDEE CAPACITY</span>
                <span className="text-foreground bg-secondary px-1.5 py-0.5 rounded font-mono">
                  {capacity} seats
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                disabled={isLoading}
                className="w-full accent-primary bg-secondary/80 rounded-lg cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                <span>5</span>
                <span>100</span>
                <span>250</span>
                <span>500</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Venue & Requirements Selection */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Preferred Venue Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                PREFERRED CAMPUS VENUE
              </label>
              {loadingResources ? (
                <div className="text-xs text-muted-foreground animate-pulse py-2">Loading campus facilities inventory...</div>
              ) : (
                <select
                  value={preferredVenueId}
                  onChange={(e) => setPreferredVenueId(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                  required
                >
                  <option value="">-- Choose Venue --</option>
                  {resources.map((res) => (
                    <option key={res._id} value={res._id}>
                      {res.name} ({res.location} | Cap: {res.capacity} seats | {res.status})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Smart Capacity Warning Overlay */}
            {capacityWarning && (
              <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-3 text-xs flex gap-2.5 items-start text-amber-600 dark:text-amber-400">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold uppercase tracking-wide text-[10px]">Venue Overcrowding Alert</h5>
                  <p className="mt-0.5 leading-relaxed text-[11px]">
                    Expected attendee capacity ({capacity} seats) exceeds the maximum seating limit of <strong>{selectedVenue?.name}</strong> ({selectedVenue?.capacity} seats). Consider picking a larger venue (e.g. Auditorium) or reducing capacity settings.
                  </p>
                </div>
              </div>
            )}

            {/* Smart Facilities Requirements Checklist */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                FACILITIES & EQUIPMENT REQUIREMENTS
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AMENITIES_POOL.map((amenity) => {
                  const isChecked = requirements.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleToggleRequirement(amenity)}
                      disabled={isLoading}
                      className={`flex items-center gap-2 px-3 py-2 text-left text-xs rounded-lg border transition-all duration-200 cursor-pointer ${
                        isChecked
                          ? 'bg-primary/10 border-primary text-primary font-semibold shadow-sm'
                          : 'border-border/40 hover:bg-secondary text-muted-foreground'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-border/60'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Requirement warning: selected venue lacks selected amenities */}
            {selectedVenue && missingAmenities.length > 0 && (
              <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-3 text-xs flex gap-2.5 items-start text-destructive">
                <Cpu className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold uppercase tracking-wide text-[10px]">Facility Equipment Deficit</h5>
                  <p className="mt-0.5 leading-relaxed text-[11px]">
                    The selected venue (<strong>{selectedVenue.name}</strong>) does not explicitly mention having: <strong>{missingAmenities.join(', ')}</strong>. You can proceed, but note that extra coordination may be required.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form controls */}
        <div className="border-t border-border/20 pt-4 flex justify-between items-center gap-4">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={isLoading}
                className="gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/events')}
              disabled={isLoading}
            >
              Cancel
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                disabled={isLoading}
                className="gap-1.5 cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="gap-1.5 cursor-pointer"
              >
                Submit Event Proposal <Award className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
};

export default EventForm;
export { EventForm };
