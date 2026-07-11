import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, ShieldAlert, Award } from 'lucide-react';
import type { Booking } from '../../services/booking.service';
import { useAuth } from '../../context/AuthContext';

interface BookingTableProps {
  bookings: Booking[];
  onStatusChange?: (id: string, status: Booking['status']) => void;
  updatingId?: string | null;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings, onStatusChange, updatingId }) => {
  const { user } = useAuth();

  // Faculty or Admin check for moderation privileges
  const isFacultyOrAdmin = user && (user.role === 'admin' || user.role === 'faculty' || user.role === 'dean' || user.email === 'faculty@campusos.dev');

  // Check if current user can approve/reject/revoke this specific booking
  const canModifyStatus = (b: Booking) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'dean') return true;
    if (user.role === 'faculty') {
      const resourceDept = b.resource && typeof b.resource === 'object'
        ? (b.resource.department && typeof b.resource.department === 'object' ? b.resource.department._id : b.resource.department)
        : '';
      const userDept = typeof user.department === 'object' && user.department ? (user.department as any)._id : user.department;
      return !!resourceDept && resourceDept === userDept;
    }
    if (user.email === 'faculty@campusos.dev') return true;
    return false;
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'cancelled':
        return 'bg-muted/10 text-muted-foreground border border-muted/20';
      default:
        return 'bg-muted/10 text-muted-foreground border border-muted/20';
    }
  };

  return (
    <div className="w-full overflow-hidden border border-border/40 bg-card/40 backdrop-blur-md rounded-xl shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/20 bg-secondary/30 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <th className="py-4 px-4">Booking ID</th>
              <th className="py-4 px-4">Event Details</th>
              <th className="py-4 px-4">Reserved Venue</th>
              <th className="py-4 px-4">Reservation Window</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Moderation Logs</th>
              {isFacultyOrAdmin && onStatusChange && <th className="py-4 px-4 text-right">Moderator Controls</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10 text-xs">
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr
                  key={b._id}
                  className="hover:bg-secondary/20 transition-colors duration-150 group"
                >
                  {/* ID */}
                  <td className="py-4.5 px-4 font-mono font-bold tracking-tight text-muted-foreground uppercase group-hover:text-primary transition-colors">
                    {b._id}
                  </td>

                  {/* Event details */}
                  <td className="py-4.5 px-4">
                    <div className="font-bold text-foreground line-clamp-1">{b.eventName}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">Link ID: {b.eventId}</div>
                  </td>

                  {/* Resource */}
                  <td className="py-4.5 px-4">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{b.resourceName}</span>
                    </div>
                  </td>

                  {/* Timing details */}
                  <td className="py-4.5 px-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      <span>
                        {new Date(b.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                         })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <Clock className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      <span className="font-semibold text-foreground">
                        {b.startTime} - {b.endTime}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4.5 px-4">
                    <span className={`inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>

                  {/* Logs / Reviewed By */}
                  <td className="py-4.5 px-4 text-muted-foreground font-medium">
                    {b.checkedBy ? (
                      <div className="flex items-center gap-1.5 text-foreground font-semibold">
                        <Award className="w-3.5 h-3.5 text-primary" />
                        <span>{b.checkedBy}</span>
                      </div>
                    ) : (
                      <span className="italic text-[10px]">Awaiting authorization review</span>
                    )}
                  </td>

                  {/* Actions */}
                  {isFacultyOrAdmin && onStatusChange && (
                    <td className="py-4.5 px-4 text-right">
                      {canModifyStatus(b) ? (
                        b.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onStatusChange(b._id, 'approved')}
                              disabled={updatingId === b._id}
                              className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-emerald-500 transition-all cursor-pointer"
                              title="Approve Reservation"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onStatusChange(b._id, 'rejected')}
                              disabled={updatingId === b._id}
                              className="p-1 rounded bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500 transition-all cursor-pointer"
                              title="Reject Reservation"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : b.status === 'approved' ? (
                          <button
                            onClick={() => onStatusChange(b._id, 'cancelled')}
                            disabled={updatingId === b._id}
                            className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 rounded-lg transition-all cursor-pointer"
                            title="Revoke Reservation"
                          >
                            Revoke
                          </button>
                        ) : (
                          <div className="text-[10px] text-muted-foreground italic select-none">
                            Archived state
                          </div>
                        )
                      ) : (
                        <div className="text-[10px] text-muted-foreground/60 italic select-none" title="Requires same department clearance">
                          No clearance
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isFacultyOrAdmin && onStatusChange ? 7 : 6}
                  className="py-10 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="w-8 h-8 text-muted-foreground" />
                    <span className="font-semibold">No booking records found matching specifications.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
export { BookingTable };
