import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'club' | 'student' | 'dean' | 'organizer' | 'attendee';
  department?: string | { _id: string; name: string; code: string };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  role?: string;
  department?: string; // department ID string
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

const authService = {
  // Register a new user
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/auth/register', credentials);
    return response.data;
  },

  // Login credentials verify
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> => {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/login', credentials);
    return response.data;
  },

  // Fetch current user details via token in header
  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
};

export default authService;
export { authService };
