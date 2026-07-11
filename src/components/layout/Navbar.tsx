import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import {
  Menu,
  Bell,
  Search,
  Sparkles,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  setIsMobileOpen: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  // Get current page header title based on route path
  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/dashboard')) return 'Operational Overview';
    if (pathname.startsWith('/resources')) return 'Facilities & Resources';
    if (pathname.startsWith('/events')) return 'Events Ledger';
    if (pathname.startsWith('/bookings')) return 'Reservations Registry';
    if (pathname.startsWith('/notifications')) return 'Notification Center';
    return 'Console Control Panel';
  };

  return (
    <header className="sticky top-[68px] z-20 backdrop-blur-md bg-card/60 border border-border/40 rounded-full px-6 py-3.5 mx-4 mt-2 flex items-center justify-between shadow-md transition-colors duration-300">
      
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-secondary border border-border/30 cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-extrabold text-sm leading-none tracking-tight">
            {getPageTitle(location.pathname)}
          </h1>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 block">
            CampusOS Dashboard Console
          </span>
        </div>
      </div>

      {/* Right side: Search, Notifications, Session */}
      <div className="flex items-center gap-4">
        {/* Simple visual search placeholder */}
        <div className="hidden md:flex items-center gap-2 relative">
          <input
            type="text"
            placeholder="Search console..."
            disabled
            className="w-48 bg-secondary/40 border border-border/30 rounded-lg px-3 py-1.5 pl-8 text-xs focus:outline-none opacity-60 cursor-not-allowed"
          />
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-[7px]" />
        </div>

        {/* Dynamic Fallback indicator */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          <span>Demo Offline Fallback</span>
        </div>

        {/* Notification Bell */}
        <Link to="/notifications" className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="w-9 h-9 p-0 flex items-center justify-center rounded-lg cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* User Session Profile Badge */}
        <div className="flex items-center gap-2 border border-border/30 bg-secondary/30 rounded-lg py-1 pr-2.5 pl-1.5 text-xs">
          <Avatar name={user?.name} role={user?.role} size="xs" />
          <span className="font-semibold text-foreground truncate max-w-[80px]">{user?.name}</span>
        </div>
      </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="gap-2 rounded-xl border-orange-400/25 text-orange-500 hover:border-orange-400/50 hover:bg-orange-400/10 hover:text-orange-400"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Logout</span>
        </Button>
    </header>
  );
};

export default Navbar;
export { Navbar };
