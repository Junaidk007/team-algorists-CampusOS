import api from './api';
import type { ApiResponse } from './auth.service';

export interface Resource {
  _id: string;
  name: string;
  type: string; // 'classroom', 'laboratory', 'seminar_hall', 'auditorium', 'conference_room'
  capacity: number;
  status: 'available' | 'maintenance' | 'reserved' | 'occupied' | 'booked';
  location: string;
  floor?: number;
  department: string | { _id: string; name: string; code: string };
  description?: string;
  amenities?: string[];
  facilities?: string[];
}

const resourceService = {
  getResources: async (params?: Record<string, any>): Promise<ApiResponse<Resource[]>> => {
    const response = await api.get<ApiResponse<Resource[]>>('/resources', { params });
    return response.data;
  },

  getResourceById: async (id: string): Promise<ApiResponse<Resource>> => {
    const response = await api.get<ApiResponse<Resource>>(`/resources/${id}`);
    return response.data;
  },

  createResource: async (resourceData: Partial<Resource>): Promise<ApiResponse<Resource>> => {
    const response = await api.post<ApiResponse<Resource>>('/resources', resourceData);
    return response.data;
  },

  updateResource: async (id: string, resourceData: Partial<Resource>): Promise<ApiResponse<Resource>> => {
    const response = await api.put<ApiResponse<Resource>>(`/resources/${id}`, resourceData);
    return response.data;
  },

  deleteResource: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete<ApiResponse<any>>(`/resources/${id}`);
    return response.data;
  }
};

export default resourceService;
export { resourceService };
