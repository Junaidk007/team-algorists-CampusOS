import api from './api';
import type { ApiResponse } from './auth.service';

export type NotificationType = 'booking-approved' | 'booking-rejected' | 'booking-updated' | 'venue-changed' | 'event-cancelled' | 'system';

export interface CampusNotification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'campusos-notifications';

const MOCK_NOTIFICATIONS: CampusNotification[] = [
  { _id: 'notice-001', title: 'Booking approved', message: 'Main Campus Auditorium is approved for the CampusOS National Hackathon.', type: 'booking-approved', isRead: false, createdAt: '2026-07-10T08:30:00.000Z' },
  { _id: 'notice-002', title: 'Action required', message: 'The Quantum Physics Lab reservation is awaiting faculty review.', type: 'booking-updated', isRead: false, createdAt: '2026-07-09T13:00:00.000Z' },
  { _id: 'notice-003', title: 'System update', message: 'Campus resource availability has been refreshed.', type: 'system', isRead: true, createdAt: '2026-07-08T09:15:00.000Z' },
];

const loadNotifications = (): CampusNotification[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
    return MOCK_NOTIFICATIONS;
  }

  try {
    return JSON.parse(stored) as CampusNotification[];
  } catch {
    return MOCK_NOTIFICATIONS;
  }
};

const saveNotifications = (notifications: CampusNotification[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

const notificationService = {
  async getNotifications(): Promise<ApiResponse<CampusNotification[]>> {
    try {
      const response = await api.get<ApiResponse<CampusNotification[]>>('/notifications');
      if (response.data.success) return response.data;
      throw new Error('Invalid notifications payload');
    } catch {
      return { statusCode: 200, data: loadNotifications(), message: 'Loaded offline notifications.', success: true };
    }
  },

  async markAsRead(id: string): Promise<ApiResponse<CampusNotification[]>> {
    try {
      const response = await api.patch<ApiResponse<CampusNotification[]>>('/notifications/read', { ids: [id] });
      if (response.data.success) return response.data;
      throw new Error('Unable to mark notification as read');
    } catch {
      const notifications = loadNotifications().map((notification) => notification._id === id ? { ...notification, isRead: true } : notification);
      saveNotifications(notifications);
      return { statusCode: 200, data: notifications, message: 'Notification marked as read.', success: true };
    }
  },

  async markAllAsRead(): Promise<ApiResponse<CampusNotification[]>> {
    try {
      const response = await api.patch<ApiResponse<CampusNotification[]>>('/notifications/read', { all: true });
      if (response.data.success) return response.data;
      throw new Error('Unable to mark notifications as read');
    } catch {
      const notifications = loadNotifications().map((notification) => ({ ...notification, isRead: true }));
      saveNotifications(notifications);
      return { statusCode: 200, data: notifications, message: 'All notifications marked as read.', success: true };
    }
  },
};

export default notificationService;