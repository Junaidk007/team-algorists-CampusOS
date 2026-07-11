/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import notificationService from '../services/notification.service';
import type { CampusNotification } from '../services/notification.service';

interface NotificationContextType {
  notifications: CampusNotification[];
  loading: boolean;
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<CampusNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    notificationService.getNotifications().then((response) => {
      if (!isMounted) return;
      if (response.success) setNotifications(response.data);
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.isRead).length, [notifications]);

  const markAsRead = async (id: string) => {
    const response = await notificationService.markAsRead(id);
    if (response.success) setNotifications(response.data);
  };

  const markAllAsRead = async () => {
    const response = await notificationService.markAllAsRead();
    if (response.success) setNotifications(response.data);
  };

  return <NotificationContext.Provider value={{ notifications, loading, unreadCount, markAsRead, markAllAsRead }}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};