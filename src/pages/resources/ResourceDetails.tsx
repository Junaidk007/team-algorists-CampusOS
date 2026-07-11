import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import resourceService from '../../services/resource.service';
import type { Resource } from '../../services/resource.service';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Shield,
  Laptop,
  BookOpen,
  Video,
  CheckCircle,
} from 'lucide-react';

const ResourceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Data states
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      const response = await resourceService.getResourceById(id);
      if (response.success && response.data) {
        setResource(response.data);
      } else {
        setError(response.message || 'Failed to fetch details.');
      }
      setLoading(false);
    };

    fetchDetails();
  }, [id]);

  // Icon type mapping
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'lab':
        return <Laptop className="w-5 h-5 text-indigo-500" />;
      case 'auditorium':
        return <Video className="w-5 h-5 text-violet-500" />;
      case 'classroom':
      default:
        return <BookOpen className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'reserved':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center flex-col gap-3">
        <Spinner className="w-8 h-8 text-primary" />
        <span className="text-xs text-muted-foreground animate-pulse font-medium">
          Retrieving facility documentation...
        </span>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 border border-border/40 rounded-xl bg-card shadow-sm flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold">Resource Not Found</h2>
          <p className="text-sm text-muted-foreground">
            {error || 'The requested university asset cannot be located.'}
          </p>
          <Button variant="primary" onClick={() => navigate('/resources')}>
            Return to Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none relative z-10">
      
      {/* Navigation Breadcrumb back */}
      <div className="flex items-center justify-between border-b border-border/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent border border-border/30 transition-all cursor-pointer"
            aria-label="Back to catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Facility Documentation</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reviewing: <strong>{resource.name}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Details layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width on desktop): Detailed Specifications */}
        <section className="md:col-span-2 space-y-6">
          <Card className="border border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
            <CardContent className="p-8 space-y-6">
              
              {/* Type Badge & Status Row */}
              <div className="flex items-center justify-between border-b border-border/10 pb-4">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  {getTypeIcon(resource.type)}
                  <span>{resource.type} Specifications</span>
                </div>
                <Badge variant={getStatusVariant(resource.status)}>
                  {resource.status}
                </Badge>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h2 className="text-2xl font-extrabold tracking-tight">{resource.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                  {resource.description || 'No detailed descriptive data available for this facility. Please contact the department coordinator.'}
                </p>
              </div>

              {/* Amenities list */}
              {resource.amenities && resource.amenities.length > 0 && (
                <div className="pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Available Amenities & Tech Equipment
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {resource.amenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/80 border border-border/20 text-xs font-medium text-foreground transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Right Column (1/3 width on desktop): Logistics & Quick Booking Panel */}
        <section className="md:col-span-1 space-y-6">
          {/* Quick Metrics Card */}
          <Card className="border border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>LOGISTICS & ACCESS</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/20">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Location Coordinates</p>
                    <p className="text-muted-foreground mt-0.5">{resource.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/20">
                  <Users className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">Seating Limit</p>
                    <p className="text-muted-foreground mt-0.5">{resource.capacity} seats max</p>
                  </div>
                </div>
              </div>

              {/* Booking trigger action */}
              <div className="pt-4 border-t border-border/10">
                {showAlert && (
                  <Alert variant="info" className="mb-4" onClose={() => setShowAlert(false)}>
                    Room reservation forms and calendar schedules are coming in Phase 5 & 6!
                  </Alert>
                )}

                <Button
                  variant="primary"
                  className="w-full gap-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer py-2.5"
                  onClick={() => setShowAlert(true)}
                  disabled={resource.status === 'maintenance'}
                >
                  <Calendar className="w-4 h-4" />
                  {resource.status === 'available' ? 'Schedule Booking' : 'Request Allocation'}
                </Button>
                
                {resource.status === 'maintenance' && (
                  <p className="text-[10px] text-destructive text-center mt-2 font-medium">
                    * Booking disabled while resource is under maintenance.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ResourceDetails;
export { ResourceDetails };
