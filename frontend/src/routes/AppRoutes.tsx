import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardHome } from '../pages/DashboardHome';
import { PatientsList } from '../pages/PatientsList';
import { Appointments } from '../pages/Appointments';
import { Consultations } from '../pages/Consultations';
import { Laboratory } from '../pages/Laboratory';
import { Pharmacy } from '../pages/Pharmacy';
import { Billing } from '../pages/Billing';
import { Reports } from '../pages/Reports';
import { AiAssistant } from '../pages/AiAssistant';
import { UserManagement } from '../pages/UserManagement';
import { Security } from '../pages/Security';
import { Unauthorized } from '../pages/Unauthorized';
import { PatientProfile } from '../pages/PatientProfile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardHome />} />
          
          {/* General clinical team paths */}
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/laboratory" element={<Laboratory />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />

          {/* Admin panel only paths */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/security" element={<Security />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
