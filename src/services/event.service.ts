import api from './api';
import type { ApiResponse } from './auth.service';

export interface Event {
  _id: string;
  name: string;
  type: string; // 'workshop' | 'seminar' | 'hackathon' | 'cultural' | 'other'
  description: string;
  hostedBy: string;
  department: string;
  capacity: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  preferredVenueId: string;
  preferredVenueName: string;
  requirements: string[];
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  organizerId: string;
  organizer?: string | { _id: string; name: string; email: string };
  createdAt: string;
}

const mapBackendToFrontend = (b: any): Event => {
  // Helpers to prevent timezone/date-shift bugs
  const formatLocalTime = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '09:00';
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatLocalDate = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '2026-07-20';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Find department ID
  let deptId = '';
  if (b.department) {
    if (typeof b.department === 'object') {
      deptId = b.department._id || '';
    } else {
      deptId = b.department;
    }
  }

  // Find preferred venue
  let venueId = '';
  let venueName = 'N/A';
  if (b.preferredVenue) {
    if (typeof b.preferredVenue === 'object') {
      venueId = b.preferredVenue._id || '';
      venueName = b.preferredVenue.name || 'N/A';
    } else {
      venueId = b.preferredVenue;
    }
  }

  // Find organizer
  let orgId = '';
  if (b.organizer) {
    if (typeof b.organizer === 'object') {
      orgId = b.organizer._id || '';
    } else {
      orgId = b.organizer;
    }
  }

  return {
    _id: b._id || '',
    name: b.title || '',
    type: b.type || 'other',
    description: b.description || '',
    hostedBy: b.hostedBy || (b.organizer && typeof b.organizer === 'object' ? b.organizer.name : 'Unknown'),
    department: deptId,
    capacity: b.expectedCapacity || 1,
    date: b.startDate ? formatLocalDate(b.startDate) : '2026-07-20',
    startTime: b.startDate ? formatLocalTime(b.startDate) : '09:00',
    endTime: b.endDate ? formatLocalTime(b.endDate) : '10:00',
    preferredVenueId: venueId,
    preferredVenueName: venueName,
    requirements: b.requirements || [],
    status: b.status || 'pending',
    organizerId: orgId,
    createdAt: b.createdAt || new Date().toISOString(),
  };
};

const mapFrontendToBackend = (f: any): any => {
  const res: any = {};
  if (f.name !== undefined) res.title = f.name;
  if (f.type !== undefined) res.type = f.type;
  if (f.description !== undefined) res.description = f.description;
  if (f.hostedBy !== undefined) res.hostedBy = f.hostedBy;
  if (f.department !== undefined) res.department = f.department;
  if (f.capacity !== undefined) res.expectedCapacity = Number(f.capacity);
  if (f.requirements !== undefined) res.requirements = f.requirements;
  if (f.preferredVenueId !== undefined) {
    res.preferredVenue = f.preferredVenueId === '' ? null : f.preferredVenueId;
  }
  if (f.status !== undefined) res.status = f.status;

  if (f.date && f.startTime) {
    res.startDate = new Date(`${f.date}T${f.startTime}:00`).toISOString();
  }
  if (f.date && f.endTime) {
    res.endDate = new Date(`${f.date}T${f.endTime}:00`).toISOString();
  }
  return res;
};

const eventService = {
  getEvents: async (): Promise<ApiResponse<Event[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/events');
    const mappedData = response.data.data ? response.data.data.map(mapBackendToFrontend) : [];
    return {
      ...response.data,
      data: mappedData,
    } as unknown as ApiResponse<Event[]>;
  },

  getEventById: async (id: string): Promise<ApiResponse<Event | null>> => {
    const response = await api.get<ApiResponse<any>>(`/events/${id}`);
    const mappedData = response.data.data ? mapBackendToFrontend(response.data.data) : null;
    return {
      ...response.data,
      data: mappedData,
    } as unknown as ApiResponse<Event | null>;
  },

  createEvent: async (eventData: Omit<Event, '_id' | 'createdAt' | 'status' | 'organizerId'>): Promise<ApiResponse<Event>> => {
    const backendData = mapFrontendToBackend(eventData);
    const response = await api.post<ApiResponse<any>>('/events', backendData);
    const mappedData = response.data.data ? mapBackendToFrontend(response.data.data) : null;
    return {
      ...response.data,
      data: mappedData,
    } as unknown as ApiResponse<Event>;
  },

  updateEvent: async (id: string, eventData: Partial<Event>): Promise<ApiResponse<Event | null>> => {
    const backendData = mapFrontendToBackend(eventData);
    const response = await api.put<ApiResponse<any>>(`/events/${id}`, backendData);
    const mappedData = response.data.data ? mapBackendToFrontend(response.data.data) : null;
    return {
      ...response.data,
      data: mappedData,
    } as unknown as ApiResponse<Event | null>;
  },

  deleteEvent: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/events/${id}`);
    return response.data;
  },
};

export default eventService;
export { eventService };
