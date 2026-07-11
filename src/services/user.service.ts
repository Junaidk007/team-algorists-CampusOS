import api from './api';
import type { ApiResponse } from './auth.service';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'club' | 'student' | 'dean';
  department?: string | { _id: string; name: string; code: string };
  createdAt?: string;
  updatedAt?: string;
}

const userService = {
  getUsers: async (role?: string): Promise<ApiResponse<User[]>> => {
    const params = role ? { role } : undefined;
    const response = await api.get<ApiResponse<User[]>>('/users', { params });
    return response.data;
  },

  createUser: async (userData: Partial<User> & { password?: string }): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User> & { password?: string }): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete<ApiResponse<any>>(`/users/${id}`);
    return response.data;
  }
};

export default userService;
export { userService };
