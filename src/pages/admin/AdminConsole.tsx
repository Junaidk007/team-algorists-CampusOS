import React, { useState, useEffect } from 'react';
import departmentService from '../../services/department.service';
import type { Department } from '../../services/department.service';
import resourceService from '../../services/resource.service';
import type { Resource } from '../../services/resource.service';
import userService from '../../services/user.service';
import type { User } from '../../services/user.service';
import eventService from '../../services/event.service';
import type { Event } from '../../services/event.service';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import {
  Building,
  GraduationCap,
  Sparkles,
  Users,
  Shield,
  Plus,
  Trash2,
  Edit,
  Search,
  BookOpen,
  X,
  AlertCircle,
  Calendar,
} from 'lucide-react';

const AdminConsole: React.FC = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'departments' | 'resources' | 'events' | 'faculties' | 'clubs' | 'students' | 'deans'>('departments');

  // Loading & State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Lists
  const [departments, setDepartments] = useState<Department[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Selected item for Edit (only for User management in this context, resources/departments are just Add/Delete)
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Event Form states
  const [evtName, setEvtName] = useState('');
  const [evtType, setEvtType] = useState('workshop');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtHostedBy, setEvtHostedBy] = useState('');
  const [evtDeptId, setEvtDeptId] = useState('');
  const [evtCapacity, setEvtCapacity] = useState(10);
  const [evtVenueId, setEvtVenueId] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtStartTime, setEvtStartTime] = useState('');
  const [evtEndTime, setEvtEndTime] = useState('');
  const [evtRequirements, setEvtRequirements] = useState('');
  const [evtStatus, setEvtStatus] = useState<'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'>('pending');

  const openEventModal = (evt: Event | null = null) => {
    setEditingEvent(evt);
    if (evt) {
      setEvtName(evt.name);
      setEvtType(evt.type);
      setEvtDesc(evt.description || '');
      setEvtHostedBy(evt.hostedBy);
      setEvtDeptId(evt.department);
      setEvtCapacity(evt.capacity);
      setEvtVenueId(evt.preferredVenueId || '');
      setEvtDate(evt.date);
      setEvtStartTime(evt.startTime);
      setEvtEndTime(evt.endTime);
      setEvtRequirements(evt.requirements ? evt.requirements.join(', ') : '');
      setEvtStatus(evt.status);
    } else {
      setEvtName('');
      setEvtType('workshop');
      setEvtDesc('');
      setEvtHostedBy('');
      setEvtDeptId(departments[0]?._id || '');
      setEvtCapacity(20);
      setEvtVenueId('');
      setEvtDate('');
      setEvtStartTime('09:00');
      setEvtEndTime('11:00');
      setEvtRequirements('');
      setEvtStatus('pending');
    }
    setIsEventModalOpen(true);
  };

  const openDeptModal = (dept: Department | null = null) => {
    setEditingDept(dept);
    if (dept) {
      setDeptName(dept.name);
      setDeptCode(dept.code);
      setDeptDesc(dept.description || '');
      setDeptFloors(dept.floors || 1);
      setDeptRooms(dept.rooms || 0);
      setDeptLabs(dept.labs || 0);
    } else {
      setDeptName('');
      setDeptCode('');
      setDeptDesc('');
      setDeptFloors(1);
      setDeptRooms(0);
      setDeptLabs(0);
    }
    setIsDeptModalOpen(true);
  };

  // Form states
  // Department
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptFloors, setDeptFloors] = useState(1);
  const [deptRooms, setDeptRooms] = useState(0);
  const [deptLabs, setDeptLabs] = useState(0);

  // Resource
  const [resName, setResName] = useState('');
  const [resType, setResType] = useState('classroom');
  const [resCapacity, setResCapacity] = useState(10);
  const [resFloor, setResFloor] = useState(0);
  const [resLocation, setResLocation] = useState('');
  const [resDeptId, setResDeptId] = useState('');
  const [resFacilities, setResFacilities] = useState('');

  // User (Faculty/Club/Student/Dean)
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userDeptId, setUserDeptId] = useState('');

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'departments') {
        const res = await departmentService.getDepartments();
        if (res.success && res.data) setDepartments(res.data);
      } else if (activeTab === 'resources') {
        const res = await resourceService.getResources();
        // Fetch departments as well for the department dropdown when creating a resource
        const deptRes = await departmentService.getDepartments();
        if (res.success && res.data) setResources(res.data);
        if (deptRes.success && deptRes.data) setDepartments(deptRes.data);
      } else if (activeTab === 'events') {
        const res = await eventService.getEvents();
        const deptRes = await departmentService.getDepartments();
        const venueRes = await resourceService.getResources();
        if (res.success && res.data) setEvents(res.data);
        if (deptRes.success && deptRes.data) setDepartments(deptRes.data);
        if (venueRes.success && venueRes.data) setResources(venueRes.data);
      } else {
        // Map activeTab to roles
        const roleMap: Record<string, string> = {
          faculties: 'faculty',
          clubs: 'club',
          students: 'student',
          deans: 'dean',
        };
        const selectedRole = roleMap[activeTab];
        const res = await userService.getUsers(selectedRole);
        // Fetch departments for user forms
        const deptRes = await departmentService.getDepartments();
        if (res.success && res.data) setUsers(res.data);
        if (deptRes.success && deptRes.data) setDepartments(deptRes.data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch administrative data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setSearchTerm('');
  }, [activeTab]);

  // Actions
  // 1. Department Actions
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const deptData = {
        name: deptName,
        code: deptCode,
        description: deptDesc,
        floors: Number(deptFloors),
        rooms: Number(deptRooms),
        labs: Number(deptLabs),
      };

      if (editingDept) {
        const res = await departmentService.updateDepartment(editingDept._id, deptData);
        if (res.success) {
          setSuccess('Department updated successfully.');
          setIsDeptModalOpen(false);
          fetchData();
        }
      } else {
        const res = await departmentService.createDepartment(deptData);
        if (res.success) {
          setSuccess('Department registered successfully.');
          setIsDeptModalOpen(false);
          // Reset form
          setDeptName('');
          setDeptCode('');
          setDeptDesc('');
          setDeptFloors(1);
          setDeptRooms(0);
          setDeptLabs(0);
          fetchData();
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save department.');
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this department? All associated resources may lose reference.')) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await departmentService.deleteDepartment(id);
      if (res.success) {
        setSuccess('Department deleted successfully.');
        fetchData();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete department.');
    }
  };

  // 2. Resource Actions
  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!resDeptId) {
      setError('Please select a department for this resource.');
      return;
    }
    try {
      const facilitiesArray = resFacilities
        ? resFacilities.split(',').map((f) => f.trim()).filter((f) => f.length > 0)
        : [];
      const res = await resourceService.createResource({
        name: resName,
        type: resType,
        capacity: Number(resCapacity),
        floor: Number(resFloor),
        location: resLocation,
        department: resDeptId,
        facilities: facilitiesArray,
      });
      if (res.success) {
        setSuccess('Resource facility added successfully.');
        setIsResourceModalOpen(false);
        // Reset form
        setResName('');
        setResType('classroom');
        setResCapacity(10);
        setResFloor(0);
        setResLocation('');
        setResDeptId('');
        setResFacilities('');
        fetchData();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create resource.');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this facility resource?')) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await resourceService.deleteResource(id);
      if (res.success) {
        setSuccess('Resource deleted successfully.');
        fetchData();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete resource.');
    }
  };

  // 3. User Actions (Faculty, Club, Student, Dean)
  const openUserModal = (user: User | null = null) => {
    setEditingUser(user);
    if (user) {
      setUserName(user.name);
      setUserEmail(user.email);
      setUserPassword('');
      setUserDeptId(
        user.department
          ? typeof user.department === 'string'
            ? user.department
            : user.department._id
          : ''
      );
    } else {
      setUserName('');
      setUserEmail('');
      setUserPassword('');
      setUserDeptId('');
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const roleMap: Record<string, 'faculty' | 'club' | 'student' | 'dean'> = {
      faculties: 'faculty',
      clubs: 'club',
      students: 'student',
      deans: 'dean',
    };
    const currentRole = roleMap[activeTab];

    try {
      if (editingUser) {
        // Edit User
        const updateData: any = {
          name: userName,
          email: userEmail,
          department: userDeptId || null,
        };
        if (userPassword) {
          updateData.password = userPassword;
        }
        const res = await userService.updateUser(editingUser._id, updateData);
        if (res.success) {
          setSuccess('User updated successfully.');
          setIsUserModalOpen(false);
          fetchData();
        }
      } else {
        // Create User
        if (!userPassword) {
          setError('Password is required for new users.');
          return;
        }
        const res = await userService.createUser({
          name: userName,
          email: userEmail,
          password: userPassword,
          role: currentRole,
          department: userDeptId || undefined,
        });
        if (res.success) {
          setSuccess('User created successfully.');
          setIsUserModalOpen(false);
          fetchData();
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save user.');
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const eventData = {
        name: evtName,
        type: evtType,
        description: evtDesc,
        hostedBy: evtHostedBy,
        department: evtDeptId,
        capacity: Number(evtCapacity),
        preferredVenueId: evtVenueId,
        preferredVenueName: resources.find(r => r._id === evtVenueId)?.name || '',
        date: evtDate,
        startTime: evtStartTime,
        endTime: evtEndTime,
        requirements: evtRequirements.split(',').map(s => s.trim()).filter(Boolean),
        status: evtStatus,
      };

      if (editingEvent) {
        const res = await eventService.updateEvent(editingEvent._id, eventData);
        if (res.success) {
          setSuccess('Event updated successfully.');
          setIsEventModalOpen(false);
          fetchData();
        }
      } else {
        const res = await eventService.createEvent(eventData);
        if (res.success) {
          setSuccess('Event created successfully.');
          setIsEventModalOpen(false);
          fetchData();
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save event.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete/cancel this event? This action cannot be undone.')) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await eventService.deleteEvent(id);
      if (res.success) {
        setSuccess('Event deleted successfully.');
        fetchData();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete event.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await userService.deleteUser(id);
      if (res.success) {
        setSuccess('User deleted successfully.');
        fetchData();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete user.');
    }
  };

  // Filters
  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResources = resources.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.hostedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTabTitle = () => {
    switch (activeTab) {
      case 'departments': return 'Academic Departments';
      case 'resources': return 'Facility Resources';
      case 'events': return 'Campus Events Registry';
      case 'faculties': return 'Faculty Coordinators';
      case 'clubs': return 'Club Organizers';
      case 'students': return 'Students List';
      case 'deans': return 'University Deans';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 select-none relative z-10">
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-border/10 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Administrative Console</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage university departments, physical facilities, student access, and staff coordinators.
          </p>
        </div>
      </div>

      {/* Error / Success Alerts */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-destructive animate-fadeIn text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 animate-fadeIn text-xs">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: tabs */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <Card className="border border-border/40 bg-card/60 backdrop-blur-md sticky top-[84px] shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>Console Sections</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5">
              {[
                { id: 'departments', label: 'Departments', icon: <Building className="w-4 h-4" /> },
                { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> },
                { id: 'events', label: 'Campus Events', icon: <Calendar className="w-4 h-4" /> },
                { id: 'faculties', label: 'Faculty Staff', icon: <GraduationCap className="w-4 h-4" /> },
                { id: 'clubs', label: 'Clubs Info', icon: <Sparkles className="w-4 h-4" /> },
                { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
                { id: 'deans', label: 'Deans Desk', icon: <GraduationCap className="w-4 h-4" /> },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-3 w-full px-3.5 py-2.5 text-xs rounded-lg text-left transition-all duration-200 cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Right column: CRUD view */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Header toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight">{getTabTitle()}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Overview list and management triggers for this registry.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 pl-8 pr-3 py-1.5 text-xs rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              {/* Add Button */}
              {activeTab === 'departments' && (
                <Button variant="primary" size="sm" className="gap-1.5" onClick={() => openDeptModal(null)}>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dept</span>
                </Button>
              )}
              {activeTab === 'resources' && (
                <Button variant="primary" size="sm" className="gap-1.5" onClick={() => setIsResourceModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Facility</span>
                </Button>
              )}
              {activeTab === 'events' && (
                <Button variant="primary" size="sm" className="gap-1.5" onClick={() => openEventModal(null)}>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Event</span>
                </Button>
              )}
              {['faculties', 'clubs', 'students', 'deans'].includes(activeTab) && (
                <Button variant="primary" size="sm" className="gap-1.5" onClick={() => openUserModal(null)}>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add User</span>
                </Button>
              )}
            </div>
          </div>

          {/* Loader or Grid */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <Spinner className="w-8 h-8 text-primary" />
              <p className="text-xs text-muted-foreground animate-pulse font-medium">
                Syncing administrative registries...
              </p>
            </div>
          ) : (
            <Card className="border border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
              <CardContent className="p-0 overflow-x-auto overflow-y-auto max-h-[500px] relative scrollbar-thin scrollbar-thumb-border">
                
                {/* 1. Departments Table */}
                {activeTab === 'departments' && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-card/95 backdrop-blur-md z-10 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                      <tr className="border-b border-border/20 bg-secondary/50 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        <th className="py-3 px-4">Code</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Floors</th>
                        <th className="py-3 px-4">Rooms/Labs</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                      {filteredDepartments.length > 0 ? (
                        filteredDepartments.map((d) => (
                          <tr key={d._id} className="hover:bg-secondary/20 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-primary">{d.code}</td>
                            <td className="py-3.5 px-4 font-semibold">{d.name}</td>
                            <td className="py-3.5 px-4 text-muted-foreground">{d.floors || 1} Floors</td>
                            <td className="py-3.5 px-4 text-muted-foreground">
                              {d.rooms || 0} Rooms / {d.labs || 0} Labs
                            </td>
                            <td className="py-3.5 px-4 text-right flex justify-end gap-1.5">
                              <button
                                onClick={() => openDeptModal(d)}
                                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                title="Edit Department"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDept(d._id)}
                                className="p-1 rounded hover:bg-destructive/10 text-destructive/80 hover:text-destructive cursor-pointer transition-colors"
                                title="Delete Department"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">No departments registered.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* 2. Resources Table */}
                {activeTab === 'resources' && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-card/95 backdrop-blur-md z-10 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                      <tr className="border-b border-border/20 bg-secondary/50 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        <th className="py-3 px-4">Facility</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Capacity</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                      {filteredResources.length > 0 ? (
                        filteredResources.map((r) => {
                          const deptName = typeof r.department === 'object' && r.department ? r.department.name : 'N/A';
                          return (
                            <tr key={r._id} className="hover:bg-secondary/20 transition-colors">
                              <td className="py-3.5 px-4 font-semibold">{r.name}</td>
                              <td className="py-3.5 px-4 capitalize font-mono text-[10px] text-muted-foreground">{r.type}</td>
                              <td className="py-3.5 px-4">{r.capacity} seats</td>
                              <td className="py-3.5 px-4 text-muted-foreground">{r.location || `Floor ${r.floor || 0}`}</td>
                              <td className="py-3.5 px-4 text-muted-foreground">{deptName}</td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => handleDeleteResource(r._id)}
                                  className="p-1 rounded hover:bg-destructive/10 text-destructive/80 hover:text-destructive cursor-pointer transition-colors"
                                  title="Delete Resource"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">No resources registered.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* 3. Events Table */}
                {activeTab === 'events' && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-card/95 backdrop-blur-md z-10 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                      <tr className="border-b border-border/20 bg-secondary/50 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        <th className="py-3 px-4">Event Name</th>
                        <th className="py-3 px-4">Hosted By</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Venue</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((e) => {
                          return (
                            <tr key={e._id} className="hover:bg-secondary/20 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-foreground">{e.name}</div>
                                <div className="text-[10px] text-muted-foreground line-clamp-1">{e.description}</div>
                              </td>
                              <td className="py-3.5 px-4 font-medium text-muted-foreground">{e.hostedBy}</td>
                              <td className="py-3.5 px-4 capitalize font-mono text-[10px] text-muted-foreground">{e.type}</td>
                              <td className="py-3.5 px-4 font-mono text-muted-foreground">
                                {e.date} @ {e.startTime} - {e.endTime}
                              </td>
                              <td className="py-3.5 px-4 text-muted-foreground">{e.preferredVenueName}</td>
                              <td className="py-3.5 px-4">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  e.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                  e.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                  e.status === 'completed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                  'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                  {e.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right flex justify-end gap-1.5">
                                <button
                                  onClick={() => openEventModal(e)}
                                  className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                  title="Edit Event"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(e._id)}
                                  className="p-1 rounded hover:bg-destructive/10 text-destructive/80 hover:text-destructive cursor-pointer transition-colors"
                                  title="Delete Event"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-muted-foreground">No campus events registered.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* 4. Users Table (Faculties, Clubs, Students, Deans) */}
                {['faculties', 'clubs', 'students', 'deans'].includes(activeTab) && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-card/95 backdrop-blur-md z-10 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]">
                      <tr className="border-b border-border/20 bg-secondary/50 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Associated Department</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => {
                          const deptName = typeof u.department === 'object' && u.department ? u.department.name : 'All-Campus';
                          return (
                            <tr key={u._id} className="hover:bg-secondary/20 transition-colors">
                              <td className="py-3.5 px-4 font-semibold">{u.name}</td>
                              <td className="py-3.5 px-4 text-muted-foreground font-mono">{u.email}</td>
                              <td className="py-3.5 px-4 text-muted-foreground">{deptName}</td>
                              <td className="py-3.5 px-4 text-right flex justify-end gap-1.5">
                                <button
                                  onClick={() => openUserModal(u)}
                                  className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                  title="Edit User"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-1 rounded hover:bg-destructive/10 text-destructive/80 hover:text-destructive cursor-pointer transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-muted-foreground">No accounts registered for this role.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

              </CardContent>
            </Card>
          )}

        </section>
      </div>

      {/* Modal 1: Create Department */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fadeIn">
          <Card className="max-w-md w-full border border-border/40 bg-card shadow-2xl relative">
            <button
              onClick={() => setIsDeptModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <CardHeader>
              <CardTitle className="text-sm font-bold tracking-wider uppercase">
                {editingDept ? 'Edit Department Details' : 'Add New Department'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveDept} className="space-y-4 text-xs">
                <Input
                  label="DEPARTMENT FULL NAME"
                  placeholder="e.g. Computer Science & Engineering"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  required
                />
                <Input
                  label="DEPARTMENT CODE"
                  placeholder="e.g. CSE"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  required
                />
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground font-semibold">DESCRIPTION</label>
                  <textarea
                    value={deptDesc}
                    onChange={(e) => setDeptDesc(e.target.value)}
                    placeholder="Brief department scope info..."
                    className="w-full min-h-[60px] px-3 py-2 border border-border/60 bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="FLOORS"
                    type="number"
                    min={1}
                    value={deptFloors}
                    onChange={(e) => setDeptFloors(Number(e.target.value))}
                  />
                  <Input
                    label="ROOMS"
                    type="number"
                    min={0}
                    value={deptRooms}
                    onChange={(e) => setDeptRooms(Number(e.target.value))}
                  />
                  <Input
                    label="LABS"
                    type="number"
                    min={0}
                    value={deptLabs}
                    onChange={(e) => setDeptLabs(Number(e.target.value))}
                  />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="outline" type="button" onClick={() => setIsDeptModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" type="submit">
                    {editingDept ? 'Save Updates' : 'Register Department'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal 2: Create Resource */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fadeIn">
          <Card className="max-w-md w-full border border-border/40 bg-card shadow-2xl relative">
            <button
              onClick={() => setIsResourceModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <CardHeader>
              <CardTitle className="text-sm font-bold tracking-wider uppercase">Add Resource Facility</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
                <Input
                  label="FACILITY/ROOM NAME"
                  placeholder="e.g. Alan Turing Computing Lab"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">RESOURCE TYPE</label>
                    <select
                      value={resType}
                      onChange={(e) => setResType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="classroom">Classroom</option>
                      <option value="laboratory">Laboratory</option>
                      <option value="seminar_hall">Seminar Hall</option>
                      <option value="auditorium">Auditorium</option>
                      <option value="conference_room">Conference Room</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">DEPARTMENT ASSOCIATED</label>
                    <select
                      value={resDeptId}
                      onChange={(e) => setResDeptId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="CAPACITY LIMIT (SEATS)"
                    type="number"
                    min={1}
                    value={resCapacity}
                    onChange={(e) => setResCapacity(Number(e.target.value))}
                    required
                  />
                  <Input
                    label="FLOOR LEVEL"
                    type="number"
                    value={resFloor}
                    onChange={(e) => setResFloor(Number(e.target.value))}
                  />
                </div>

                <Input
                  label="PHYSICAL COORDINATES / LOCATION text"
                  placeholder="e.g. Block C, 3rd Floor"
                  value={resLocation}
                  onChange={(e) => setResLocation(e.target.value)}
                />

                <Input
                  label="FACILITIES & AMENITIES (comma-separated list)"
                  placeholder="e.g. Projector, AC, Smartboard, RTX Workstations"
                  value={resFacilities}
                  onChange={(e) => setResFacilities(e.target.value)}
                />

                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="outline" type="button" onClick={() => setIsResourceModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" type="submit">Add Resource</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal 3: Create / Edit User */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fadeIn">
          <Card className="max-w-md w-full border border-border/40 bg-card shadow-2xl relative">
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <CardHeader>
              <CardTitle className="text-sm font-bold tracking-wider uppercase">
                {editingUser ? 'Edit User Credentials' : `Create New User Registry`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
                <Input
                  label="FULL DISPLAY NAME"
                  placeholder="e.g. Prof. Alan Turing"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                
                <Input
                  label="EMAIL ADDRESS"
                  type="email"
                  placeholder="e.g. turing@campusos.dev"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />

                <Input
                  label={editingUser ? 'NEW PASSWORD (leave blank to keep current)' : 'ACCOUNT ACCESS PASSWORD'}
                  type="password"
                  placeholder="••••••••"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required={!editingUser}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-semibold">DEPARTMENT ASSOCIATED</label>
                  <select
                    value={userDeptId}
                    onChange={(e) => setUserDeptId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All-Campus / None</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="outline" type="button" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" type="submit">
                    {editingUser ? 'Save Updates' : 'Register User'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal 4: Create / Edit Event */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fadeIn">
          <Card className="max-w-md w-full border border-border/40 bg-card shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <CardHeader>
              <CardTitle className="text-sm font-bold tracking-wider uppercase">
                {editingEvent ? 'Edit Campus Event' : 'Create New Event Proposal'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
                <Input
                  label="EVENT NAME/TITLE"
                  placeholder="e.g. Campus National Hackathon"
                  value={evtName}
                  onChange={(e) => setEvtName(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">EVENT TYPE</label>
                    <select
                      value={evtType}
                      onChange={(e) => setEvtType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="cultural">Cultural Event</option>
                      <option value="other">Other Event</option>
                    </select>
                  </div>
                  <Input
                    label="HOSTED BY (ORGANIZATION)"
                    placeholder="e.g. TechNeekX Coding Club"
                    value={evtHostedBy}
                    onChange={(e) => setEvtHostedBy(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-semibold">DESCRIPTION</label>
                  <textarea
                    value={evtDesc}
                    onChange={(e) => setEvtDesc(e.target.value)}
                    placeholder="Provide details about the campus event..."
                    className="w-full min-h-[60px] px-3 py-2 border border-border/60 bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">DEPARTMENT SPONSOR</label>
                    <select
                      value={evtDeptId}
                      onChange={(e) => setEvtDeptId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">PREFERRED VENUE</label>
                    <select
                      value={evtVenueId}
                      onChange={(e) => setEvtVenueId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select Venue (Optional)</option>
                      {resources.map((r) => (
                        <option key={r._id} value={r._id}>{r.name} ({r.capacity} seats)</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="EXPECTED CAPACITY LIMIT"
                    type="number"
                    min={1}
                    value={evtCapacity}
                    onChange={(e) => setEvtCapacity(Number(e.target.value))}
                    required
                  />
                  <Input
                    label="EVENT DATE"
                    type="date"
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="START TIME"
                    type="time"
                    value={evtStartTime}
                    onChange={(e) => setEvtStartTime(e.target.value)}
                    required
                  />
                  <Input
                    label="END TIME"
                    type="time"
                    value={evtEndTime}
                    onChange={(e) => setEvtEndTime(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="SPECIAL REQUIREMENTS (comma-separated list)"
                  placeholder="e.g. Projector, AC, High-Speed LAN"
                  value={evtRequirements}
                  onChange={(e) => setEvtRequirements(e.target.value)}
                />

                {editingEvent && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">APPROVAL STATUS</label>
                    <select
                      value={evtStatus}
                      onChange={(e) => setEvtStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-border/60 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="outline" type="button" onClick={() => setIsEventModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" type="submit">
                    {editingEvent ? 'Save Updates' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminConsole;
export { AdminConsole };
