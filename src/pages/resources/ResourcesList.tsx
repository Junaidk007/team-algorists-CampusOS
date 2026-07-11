import React, { useState, useEffect } from 'react';
import resourceService from '../../services/resource.service';
import type { Resource } from '../../services/resource.service';
import ResourceCard from '../../components/resources/ResourceCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import {
  Search,
  Filter,
  LayoutGrid,
  BookOpen,
  Laptop,
  Video,
  XCircle,
} from 'lucide-react';

const ResourcesList: React.FC = () => {

  // Data states
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [minCapacity, setMinCapacity] = useState<number>(0);

  // Fetch data from service
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      const response = await resourceService.getResources();
      if (response.success && response.data) {
        setResources(response.data);
      }
      setLoading(false);
    };
    fetchResources();
  }, []);

  // Filter computations
  const filteredResources = React.useMemo(() => {
    let result = resources;

    // Search query match (name, location, or amenities)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.location.toLowerCase().includes(term) ||
          (r.amenities && r.amenities.some((a) => a.toLowerCase().includes(term)))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter((r) => r.type.toLowerCase() === selectedType.toLowerCase());
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter((r) => r.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    // Capacity slider filter
    if (minCapacity > 0) {
      result = result.filter((r) => r.capacity >= minCapacity);
    }

    return result;
  }, [searchTerm, selectedType, selectedStatus, minCapacity, resources]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedStatus('all');
    setMinCapacity(0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 select-none">
        
        {/* Left Side: Filter Panels */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <Card className="border border-border/40 bg-card/60 backdrop-blur-md sticky top-[84px] shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <span>FILTER CONTROLS</span>
                </CardTitle>
                {(searchTerm || selectedType !== 'all' || selectedStatus !== 'all' || minCapacity > 0) && (
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
                  label="SEARCH BY ROOM / KEYWORDS"
                  placeholder="e.g. Auditorium, RTX, Lab..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-[32px]" />
              </div>

              {/* Resource Type filters */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Resource Type
                </label>
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'all', label: 'All Resources', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                    { id: 'classroom', label: 'Classrooms', icon: <BookOpen className="w-3.5 h-3.5" /> },
                    { id: 'lab', label: 'Laboratories', icon: <Laptop className="w-3.5 h-3.5" /> },
                    { id: 'auditorium', label: 'Auditoriums', icon: <Video className="w-3.5 h-3.5" /> },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-xs rounded-lg text-left transition-all duration-200 cursor-pointer ${
                        selectedType === t.id
                          ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                          : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                      }`}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resource Availability status filters */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Availability status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
                >
                  <option value="all">All States</option>
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>

              {/* Capacity Limit Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Minimum Capacity</span>
                  <span className="text-foreground bg-secondary px-1.5 py-0.5 rounded font-mono">
                    {minCapacity} seats
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(Number(e.target.value))}
                  className="w-full accent-primary bg-secondary/80 rounded-lg cursor-pointer h-1.5"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                  <span>0</span>
                  <span>100</span>
                  <span>250</span>
                  <span>500</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Side: Grid of Resource Cards */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          {/* Header titles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Active Campus Facilities</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Explore availability details of auditoriums, conference rooms, and science classrooms
              </p>
            </div>
            <div className="bg-secondary/40 text-muted-foreground text-xs px-3 py-1.5 rounded-lg border border-border/20 shrink-0 font-medium">
              Showing <span className="font-bold text-foreground">{filteredResources.length}</span> of {resources.length} resources
            </div>
          </div>

          {/* Loader State */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <Spinner className="w-8 h-8 text-primary" />
              <p className="text-xs text-muted-foreground animate-pulse font-medium">
                Fetching facility inventory data...
              </p>
            </div>
          ) : filteredResources.length > 0 ? (
            /* Resource Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div key={resource._id} className="animate-fadeIn">
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="border border-dashed border-border/60 rounded-xl p-16 text-center max-w-xl mx-auto flex flex-col items-center gap-4 mt-6">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <XCircle className="w-6 h-6 text-destructive/80" />
              </div>
              <div>
                <h4 className="font-bold text-base">No Facilities Match Filter Selection</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Try adjusting your keywords, expanding the seating capacity limits, or updating your room type filters.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset Filter Settings
              </Button>
            </div>
          )}
        </section>
    </div>
  );
};

export default ResourcesList;
export { ResourcesList };
