import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react';
import NotificationList from '../../components/notification/NotificationList';
import ToastAlert from '../../components/notification/ToastAlert';
import { Button } from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { useNotifications } from '../../context/NotificationContext';

const NotificationsList: React.FC = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [toast, setToast] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setToast('Notification marked as read.');
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setToast('All notifications marked as read.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-border/20 pb-5">
        <div className="flex items-start gap-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="p-2 w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold tracking-tight">Notification Center</h1>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {unreadCount} unread update{unreadCount === 1 ? '' : 's'} across your campus workspace.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0 || loading}
          className="cursor-pointer text-xs"
        >
          <CheckCheck className="mr-1.5 h-4 w-4" />
          Mark all read
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7 text-primary" />
        </div>
      ) : (
        <NotificationList notifications={notifications} onMarkAsRead={handleMarkAsRead} />
      )}

      {toast && <ToastAlert message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default NotificationsList;