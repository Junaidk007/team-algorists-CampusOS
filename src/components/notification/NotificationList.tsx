import React from 'react';
import { Bell, CheckCircle2, Circle, Info, XCircle } from 'lucide-react';
import type { CampusNotification } from '../../services/notification.service';

interface NotificationListProps {
  notifications: CampusNotification[];
  onMarkAsRead: (id: string) => void;
}

const icons = {
  'booking-approved': <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  'booking-rejected': <XCircle className="h-4 w-4 text-destructive" />,
  'booking-updated': <Bell className="h-4 w-4 text-blue-500" />,
  'venue-changed': <Bell className="h-4 w-4 text-violet-500" />,
  'event-cancelled': <XCircle className="h-4 w-4 text-destructive" />,
  system: <Info className="h-4 w-4 text-muted-foreground" />,
};

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onMarkAsRead }) => {
  if (notifications.length === 0) {
    return <div className="rounded-xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">No notifications yet.</div>;
  }

  return <div className="space-y-3">{notifications.map((notification) => (
    <article key={notification._id} className={`rounded-xl border p-4 transition-colors ${notification.isRead ? 'border-border/40 bg-card' : 'border-blue-500/25 bg-blue-500/5'}`}>
      <div className="flex gap-3">
        <div className="mt-0.5">{icons[notification.type]}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3"><h3 className="text-sm font-bold">{notification.title}</h3>{!notification.isRead && <Circle className="h-2.5 w-2.5 shrink-0 fill-blue-500 text-blue-500" />}</div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{notification.message}</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground"><span>{new Date(notification.createdAt).toLocaleString()}</span>{!notification.isRead && <button className="font-semibold text-primary hover:underline" onClick={() => onMarkAsRead(notification._id)}>Mark as read</button>}</div>
        </div>
      </div>
    </article>
  ))}</div>;
};

export default NotificationList;