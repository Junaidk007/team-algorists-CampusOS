/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/auth.service';
import type { User, LoginCredentials, RegisterCredentials } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Logout handler - defined first to avoid hoisting issues in useEffect
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campusos-token');
    localStorage.removeItem('campusos-user');
  };

  // Initialize Auth state on load: check token and fetch current user profile
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('campusos-token');
      const storedUser = localStorage.getItem('campusos-user');

      if (storedToken) {
        try {
          setToken(storedToken);
          // Query backend to verify token and fetch fresh user profile details
          const response = await authService.getMe();
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('campusos-user', JSON.stringify(response.data));
          } else {
            throw new Error('Failed to validate profile');
          }
        } catch (error) {
          console.warn('Backend validation failed. Checking offline fallback...', error);
          
          // Fallback logic for hackathon/offline demo setups:
          // If a cached user model is found locally, allow loading it to maintain active session
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        const { user: loggedInUser, token: authToken } = response.data;
        setUser(loggedInUser);
        setToken(authToken);
        localStorage.setItem('campusos-token', authToken);
        localStorage.setItem('campusos-user', JSON.stringify(loggedInUser));
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      // In hackathons, sometimes developers need to log in even when the backend is offline.
      // Let's implement an intelligent fallback: if connection fails, allow log in with specific mock demo accounts!
      const err = error as {
        response?: unknown;
        code?: string;
        message?: string;
      };
      const isConnectionError = !err.response || err.code === 'ERR_NETWORK';
      if (isConnectionError && (credentials.email === 'admin@campusos.dev' || credentials.email === 'club@campusos.dev' || credentials.email === 'faculty@campusos.dev')) {
        console.warn('Network error. Launching fallback mock session...');
        let mockRole: 'admin' | 'organizer' | 'attendee' = 'attendee';
        let mockName = 'Demo Student';

        if (credentials.email === 'admin@campusos.dev') {
          mockRole = 'admin';
          mockName = 'CampusOS Administrator';
        } else if (credentials.email === 'club@campusos.dev') {
          mockRole = 'organizer';
          mockName = 'Club Organizer (ACM)';
        } else if (credentials.email === 'faculty@campusos.dev') {
          mockRole = 'organizer';
          mockName = 'Prof. Faculty Head';
        }

        const mockUser: User = {
          _id: 'mock-user-12345',
          name: mockName,
          email: credentials.email,
          role: mockRole,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const mockToken = 'mock-jwt-token-key-67890';
        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem('campusos-token', mockToken);
        localStorage.setItem('campusos-user', JSON.stringify(mockUser));
        setLoading(false);
        return;
      }
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    try {
      const response = await authService.register(credentials);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
