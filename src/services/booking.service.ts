import api from './api';
import type { ApiResponse } from './auth.service';

export interface Booking {
  _id: string;
  eventId: string;
  eventName: string;
  resourceId: string;
  resourceName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  checkedBy?: string;
  createdAt: string;
  resource?: any; // populated raw resource from backend
}

const mapBackendToFrontend = (b: any): Booking => {
  const dateStr = b.startTime ? new Date(b.startTime).toISOString() : new Date().toISOString();
  
  let eventId = '';
  let eventName = 'N/A';
  if (b.event) {
    if (typeof b.event === 'object') {
      eventId = b.event._id || '';
      eventName = b.event.title || 'N/A';
    } else {
      eventId = b.event;
    }
  }

  let resourceId = '';
  let resourceName = 'N/A';
  if (b.resource) {
    if (typeof b.resource === 'object') {
      resourceId = b.resource._id || '';
      resourceName = b.resource.name || 'N/A';
    } else {
      resourceId = b.resource;
    }
  }

  // Parse start and end times from full ISO string
  const getHHMM = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toTimeString().split(' ')[0].substring(0, 5);
    } catch {
      return '09:00';
    }
  };

  return {
    _id: b._id || '',
    eventId,
    eventName,
    resourceId,
    resourceName,
    date: dateStr.slice(0, 10),
    startTime: b.startTime ? getHHMM(b.startTime) : '09:00',
    endTime: b.endTime ? getHHMM(b.endTime) : '10:00',
    status: b.status || 'pending',
    checkedBy: b.checkedBy || '',
    createdAt: b.createdAt || new Date().toISOString(),
    resource: b.resource,
  };
};

const bookingService = {
  // Fetch all bookings
  getBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/bookings');
    const mapped = response.data.data ? response.data.data.map(mapBackendToFrontend) : [];
    return {
      ...response.data,
      data: mapped,
    } as unknown as ApiResponse<Booking[]>;
  },

  // Fetch booking details by ID
  getBookingById: async (id: string): Promise<ApiResponse<Booking | null>> => {
    const response = await api.get<ApiResponse<any>>(`/bookings/${id}`);
    const mapped = response.data.data ? mapBackendToFrontend(response.data.data) : null;
    return {
      ...response.data,
      data: mapped,
    } as unknown as ApiResponse<Booking | null>;
  },

  // Create a new booking
  createBooking: async (bookingData: Omit<Booking, '_id' | 'createdAt'>): Promise<ApiResponse<Booking>> => {
    // Map frontend fields to backend creation payload
    const payload = {
      event: bookingData.eventId,
      resource: bookingData.resourceId,
      startTime: new Date(`${bookingData.date}T${bookingData.startTime}:00`).toISOString(),
      endTime: new Date(`${bookingData.date}T${bookingData.endTime}:00`).toISOString(),
    };
    const response = await api.post<ApiResponse<any>>('/bookings', payload);
    const mapped = response.data.data ? mapBackendToFrontend(response.data.data) : null;
    return {
      ...response.data,
      data: mapped,
    } as unknown as ApiResponse<Booking>;
  },

  // Update booking status
  updateBookingStatus: async (id: string, status: Booking['status'], checkedBy?: string): Promise<ApiResponse<Booking | null>> => {
    const response = await api.put<ApiResponse<any>>(`/bookings/${id}/status`, { status, checkedBy });
    const mapped = response.data.data ? mapBackendToFrontend(response.data.data) : null;
    return {
      ...response.data,
      data: mapped,
    } as unknown as ApiResponse<Booking | null>;
  },

  // Check conflicts automatically prior to submission
  checkConflicts: async (
    resourceId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): Promise<ApiResponse<{ conflict: boolean; eventName?: string; timeSlot?: string }>> => {
    const response = await api.post<ApiResponse<{ conflict: boolean; eventName?: string; timeSlot?: string }>>('/bookings/check-conflict', {
      resource: resourceId,
      startTime: new Date(`${date}T${startTime}:00`).toISOString(),
      endTime: new Date(`${date}T${endTime}:00`).toISOString(),
      excludeBookingId,
    });
    return response.data;
  },
};

export default bookingService;
export { bookingService };
