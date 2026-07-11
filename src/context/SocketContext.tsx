import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import notificationService, { type CampusNotification as Notification } from '../services/notification.service';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'booking';
}

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  unreadCount: number;
  toasts: ToastMessage[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addToast: (title: string, message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast helpers
  const addToast = (title: string, message: string, type: ToastMessage['type']) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch initial notifications when authenticated
  const loadInitialNotifications = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const response = await notificationService.getNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n) => !n.isRead).length);
      }
    } catch (err) {
      console.warn('Failed to load initial notifications:', err);
    }
  };

  useEffect(() => {
    loadInitialNotifications();
  }, [isAuthenticated, user]);

  // Handle Socket connection lifecycle
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const socketURL = VITE_API_URL.replace('/api', '');

    console.log(`Connecting Socket.io client to ${socketURL}`);
    const newSocket = io(socketURL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Socket.io connected successfully:', newSocket.id);
      newSocket.emit('subscribe_to_notifications', user._id);
    });

    newSocket.on('notification', (notification: Notification) => {
      console.log('Received notification via socket:', notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Map notification type to toast type
      let toastType: ToastMessage['type'] = 'info';
      if (notification.type === 'booking-approved') toastType = 'success';
      else if (notification.type === 'booking-rejected' || notification.type === 'event-cancelled') toastType = 'error';
      else if (notification.type === 'booking-updated') toastType = 'booking';
      else if (notification.type === 'venue-changed') toastType = 'warning';

      // Fire visual toast
      addToast(
        notification.title || 'System Notification',
        notification.message || 'New activity logged.',
        toastType
      );
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Mark as read API wrapper
  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // Call service (backend fallback will absorb error if connection fails)
    await notificationService.markAsRead(id);
  };

  // Mark all as read helper
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
    
    // Optimistic updates
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    // Call endpoints concurrently
    await Promise.all(unreadIds.map((id) => notificationService.markAsRead(id)));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        toasts,
        markAsRead,
        markAllAsRead,
        addToast,
        removeToast,
      }}
    >
      {children}

      {/* Floating Global Toast Stack Portal */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
        {toasts.map((toast) => {
          const typeColors = {
            info: 'border-blue-500/20 bg-blue-500/5 text-blue-500 dark:bg-blue-600/10 dark:text-blue-400',
            success: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500 dark:bg-emerald-600/10 dark:text-emerald-400',
            warning: 'border-amber-500/20 bg-amber-500/5 text-amber-500 dark:bg-amber-600/10 dark:text-amber-400',
            error: 'border-red-500/20 bg-red-500/5 text-destructive dark:bg-red-600/10 dark:text-red-400',
            booking: 'border-violet-500/20 bg-violet-500/5 text-violet-500 dark:bg-violet-600/10 dark:text-violet-400',
          };
          return (
            <div
              key={toast.id}
              className={`p-4 border rounded-xl shadow-lg backdrop-blur-md flex flex-col gap-1 pointer-events-auto animate-slideIn ${
                typeColors[toast.type]
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <span className="font-bold text-xs uppercase tracking-wide">
                  {toast.title}
                </span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground mt-0.5 text-left">
                {toast.message}
              </p>
            </div>
          );
        })}
      </div>
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
export { SocketContext };
