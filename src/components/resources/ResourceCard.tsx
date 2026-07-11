import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MapPin, Users, BookOpen, Laptop, Video, ArrowRight } from 'lucide-react';
import type { Resource } from '../../services/resource.service';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { _id, name, type, capacity, status, location } = resource;

  // Icon selector based on type
  const getTypeIcon = () => {
    switch (type.toLowerCase()) {
      case 'lab':
        return <Laptop className="w-4 h-4 text-indigo-500" />;
      case 'auditorium':
        return <Video className="w-4 h-4 text-violet-500" />;
      case 'classroom':
      default:
        return <BookOpen className="w-4 h-4 text-amber-500" />;
    }
  };

  // Status badge mapper
  const getStatusVariant = () => {
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

  return (
    <Card className="flex flex-col h-full hover:translate-y-[-4px] hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group">
      {/* Visual background gradient for card aesthetic */}
      <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-300" />

      <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          {/* Header row: type icon + availability status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {getTypeIcon()}
              <span>{type}</span>
            </div>
            <Badge variant={getStatusVariant()}>{status}</Badge>
          </div>

          {/* Resource Title */}
          <h4 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
            {name}
          </h4>

          {/* Details layout */}
          <div className="space-y-2 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>Capacity: <span className="font-semibold text-foreground">{capacity} seats</span></span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 border-t border-border/10">
          <Link to={`/resources/${_id}`}>
            <Button
              variant="secondary"
              className="w-full text-xs font-semibold justify-between group/btn cursor-pointer py-1.5"
            >
              <span>Inspect Resource</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
export { ResourceCard };
