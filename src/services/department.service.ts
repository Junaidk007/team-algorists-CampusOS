import api from './api';
import type { ApiResponse } from './auth.service';

export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  floors?: number;
  rooms?: number;
  labs?: number;
}

const departmentService = {
  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    const response = await api.get<ApiResponse<Department[]>>('/departments');
    return response.data;
  },

  getDepartmentById: async (id: string): Promise<ApiResponse<Department>> => {
    const response = await api.get<ApiResponse<Department>>(`/departments/${id}`);
    return response.data;
  },

  createDepartment: async (deptData: Partial<Department>): Promise<ApiResponse<Department>> => {
    const response = await api.post<ApiResponse<Department>>('/departments', deptData);
    return response.data;
  },

  updateDepartment: async (id: string, deptData: Partial<Department>): Promise<ApiResponse<Department>> => {
    const response = await api.put<ApiResponse<Department>>(`/departments/${id}`, deptData);
    return response.data;
  },

  deleteDepartment: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete<ApiResponse<any>>(`/departments/${id}`);
    return response.data;
  }
};

export default departmentService;
export { departmentService };
