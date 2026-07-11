import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboard.service';
import type { DashboardData } from '../../services/dashboard.service';
import StatsCard from '../../components/dashboard/StatsCard';
import UtilizationChart from '../../components/dashboard/UtilizationChart';
import ActivityChart from '../../components/dashboard/ActivityChart';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  ClipboardList,
  Building,
  Calendar,
  Activity,
  PlusCircle,
  CheckCircle2,
  Bell,
  ArrowRight,
  Shield,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboardData();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard intelligence metrics.');
      }
      setLoading(false);
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 gap-3">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-xs text-muted-foreground animate-pulse font-medium">
          Retrieving system operations telemetry...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md w-full mx-auto p-8 border border-border/40 rounded-xl bg-card text-center flex flex-col items-center gap-4 mt-12">
        <h2 className="text-xl font-bold text-destructive">Data Sync Failure</h2>
        <p className="text-sm text-muted-foreground">{error || 'Unable to load operations stats.'}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry Connections
        </Button>
      </div>
    );
  }

  const getWelcomeMessage = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return {
          title: 'CampusOS Administrator Console',
          desc: 'Monitor full-system parameters, override resource conflicts, and coordinate administrative approvals.',
          icon: Shield,
        };
      case 'organizer': {
        const isFaculty = user?.email?.includes('faculty') || user?.name?.includes('Prof');
        return {
          title: isFaculty ? 'Faculty Coordinator Desk' : 'Club Organizer Hub',
          desc: isFaculty
            ? 'Moderate student event proposals, approve resource allocations, and view department schedules.'
            : 'Plan student events, request classroom/lab allocations, and coordinate with faculty heads.',
          icon: isFaculty ? GraduationCap : Sparkles,
        };
      }
      default:
        return {
          title: 'Student Hub Console',
          desc: 'Explore active campus workshops, verify resource statuses, and propose club bookings.',
          icon: Sparkles,
        };
    }
  };

  const welcome = getWelcomeMessage(user?.role);
  const WelcomeIcon = welcome.icon;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <Card className="border border-border/30 bg-gradient-to-r from-secondary/50 via-card/50 to-secondary/30 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-primary/2 blur-2xl pointer-events-none" />
        <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <WelcomeIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight md:text-2xl">
                Welcome back, {user?.name || 'Academic Lead'}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                {welcome.desc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {(user?.role === 'admin' || user?.role === 'dean' || user?.role === 'faculty') && (
              <Link to="/bookings">
                <Button variant="primary" size="sm" className="gap-1.5 cursor-pointer shadow-sm">
                  <CheckCircle2 className="w-4 h-4" /> Approve Bookings
                </Button>
              </Link>
            )}

            {(user?.role === 'faculty' || user?.role === 'club' || user?.role === 'dean') && (
              <>
                <Link to="/events/create">
                  <Button variant="primary" size="sm" className="gap-1.5 cursor-pointer shadow-sm">
                    <PlusCircle className="w-4 h-4" /> Propose Event
                  </Button>
                </Link>
                <Link to="/resources">
                  <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                    <Building className="w-4 h-4" /> Check Venues
                  </Button>
                </Link>
              </>
            )}

            {user?.role === 'student' && (
              <Link to="/events">
                <Button variant="primary" size="sm" className="gap-1.5 cursor-pointer">
                  <Calendar className="w-4 h-4" /> Explore Events
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Resource Bookings"
          value={data.totalBookings}
          description="Approved reservations ledger"
          icon={<ClipboardList className="w-4 h-4" />}
          trend={{ value: `${data.approvedBookings} approved`, isPositive: true }}
        />

        <StatsCard
          title="Active System Resources"
          value={data.totalResources}
          description="Operational campus facilities"
          icon={<Building className="w-4 h-4" />}
          trend={{ value: `${data.activeResources} online`, isPositive: true }}
        />

        <StatsCard
          title="Event Proposals Logged"
          value={data.totalEvents}
          description="Academic & student proposals"
          icon={<Calendar className="w-4 h-4" />}
          trend={{ value: `${data.pendingEvents} pending`, isPositive: false }}
        />

        <StatsCard
          title="Campus Utilization Rate"
          value={`${data.utilizationRate}%`}
          description="Resource space occupancy weight"
          icon={<Activity className="w-4 h-4" />}
          trend={{ value: 'Optimal', isPositive: true }}
        />
      </section>

      {/* Analytics Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="min-h-[350px]">
          <UtilizationChart data={data.departmentData} />
        </div>
        <div className="min-h-[350px]">
          <ActivityChart data={data.activityData} />
        </div>
      </section>

      {/* Role-Aware Console Shortcuts */}
      <section className="border-t border-border/10 pt-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Control Panel Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border/40 bg-card/40 hover:border-primary/20 hover:bg-card/75 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-500" />
                <span>FACILITIES CATALOG</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review specific classrooms, compute centers, and auditoriums. Inspect spatial capacity, technology configurations, and availability states.
              </p>
              <Link to="/resources" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
                <span>Browse Resource Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/40 hover:border-primary/20 hover:bg-card/75 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-500" />
                <span>EVENTS DIRECTORY</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Manage upcoming student projects, academic lectures, and hackathons. Review scheduling histories, approval details, and hosted departments.
              </p>
              <Link to="/events" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
                <span>Audit Campus Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/40 hover:border-primary/20 hover:bg-card/75 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-violet-500" />
                <span>NOTIFICATION LEDGER</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                View your active system warnings, approval status logs, and general workspace notifications. Mark read items or adjust system parameters.
              </p>
              <Link to="/notifications" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
                <span>Access Notification Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
export { Dashboard };
