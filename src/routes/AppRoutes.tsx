import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/dashboard/Dashboard';
import ResourcesList from '../pages/resources/ResourcesList';
import ResourceDetails from '../pages/resources/ResourceDetails';
import EventsList from '../pages/events/EventsList';
import CreateEvent from '../pages/events/CreateEvent';
import EventDetails from '../pages/events/EventDetails';
import BookingsList from '../pages/bookings/BookingsList';
import NotificationsList from '../pages/notifications/NotificationsList';
import ProtectedRoute from './ProtectedRoute';
import AdminConsole from '../pages/admin/AdminConsole';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes mapped inside Dashboard Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resources" element={<ResourcesList />} />
          <Route path="/resources/:id" element={<ResourceDetails />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/bookings" element={<BookingsList />} />
          <Route path="/notifications" element={<NotificationsList />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminConsole />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
