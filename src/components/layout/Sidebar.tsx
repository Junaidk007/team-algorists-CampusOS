import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  LayoutDashboard,
  Building,
  Calendar,
  ClipboardList,
  Bell,
  ChevronLeft,
  ChevronRight,
  Shield,
  GraduationCap,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resources', path: '/resources', icon: Building },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Bookings', path: '/bookings', icon: ClipboardList },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: true },
  ];

  if (user?.role === 'admin') {
    navigationItems.push({ name: 'Admin Console', path: '/admin', icon: Shield });
  }

  const getRoleBadge = (role?: string) => {
    if (!role) return null;
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          label: 'Admin',
          classes: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
          icon: Shield,
        };
      case 'faculty':
        return {
          label: 'Faculty',
          classes: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
          icon: GraduationCap,
        };
      case 'club':
        return {
          label: 'Club Org',
          classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
          icon: Sparkles,
        };
      case 'dean':
        return {
          label: 'Dean',
          classes: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
          icon: GraduationCap,
        };
      case 'student':
        return {
          label: 'Student',
          classes: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
          icon: Sparkles,
        };
      case 'organizer': {
        const isFaculty = user?.email?.includes('faculty') || user?.name?.includes('Prof');
        return {
          label: isFaculty ? 'Faculty' : 'Club Org',
          classes: isFaculty
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
          icon: isFaculty ? GraduationCap : Sparkles,
        };
      }
      case 'attendee':
      default:
        return {
          label: 'Attendee',
          classes: 'bg-secondary text-muted-foreground border border-border/40',
          icon: Sparkles,
        };
    }
  };

  const badgeInfo = getRoleBadge(user?.role);
  const BadgeIcon = badgeInfo?.icon;

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-card text-card-foreground border-r border-border/40 py-6 transition-all duration-300">
      <div className="space-y-6">
        {/* Mobile Header / Brand */}
        <div className="px-6 flex items-center justify-between lg:justify-start gap-2 h-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
              C
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="font-bold text-lg tracking-tight">
                Campus<span className="text-muted-foreground text-sm font-normal">OS</span>
              </span>
            )}
          </div>
          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-secondary cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User Scope Info (only show when expanded or on mobile) */}
        {(!isCollapsed || isMobileOpen) && badgeInfo && (
          <div className="mx-4 p-3 bg-secondary/40 border border-border/20 rounded-xl flex items-center gap-2.5 animate-fadeIn">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {BadgeIcon && <BadgeIcon className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate leading-tight">{user?.name}</p>
              <span className={`inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-1 leading-none ${badgeInfo.classes}`}>
                {badgeInfo.label}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1.5 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobileOpen && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                  } ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`
                }
                title={isCollapsed && !isMobileOpen ? item.name : undefined}
              >
                <div className="relative shrink-0">
                  <Icon className="w-4 h-4" />
                  {item.badge && unreadCount > 0 && isCollapsed && !isMobileOpen && (
                    <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-destructive" />
                  )}
                </div>
                {(!isCollapsed || isMobileOpen) && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {item.badge && unreadCount > 0 && (!isCollapsed || isMobileOpen) && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-destructive text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Collapse Action Toggle (only on desktop) */}
      <div className="hidden lg:block px-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border/20 transition-all cursor-pointer font-medium"
        >
          {isCollapsed ? (
            <>
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 shrink-0 h-screen ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 h-screen bg-card transform transition-transform duration-300 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
export { Sidebar };
