import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CommunityFeed } from './pages/CommunityFeed';
import { MemberDirectory } from './pages/MemberDirectory';
import { JoinClub } from './pages/JoinClub';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { SmartTaskDistribution } from './pages/SmartTaskDistribution';
import { StudentTasks } from './pages/StudentTasks';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Teams } from './pages/Teams';
import { Events } from './pages/Events';
import { MembershipAdmin } from './pages/MembershipAdmin';
import { ActivityLogs } from './pages/ActivityLogs';
import { Profile } from './pages/Profile';
import { useClub } from './context/ClubContext';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useClub();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<CommunityFeed />} />
        <Route path="directory" element={<MemberDirectory />} />
        <Route path="join" element={<JoinClub />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Authenticated Dashboard Routes */}
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="tasks/distribute" 
          element={
            <ProtectedRoute allowedRoles={['club_admin', 'coordinator']}>
              <SmartTaskDistribution />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="tasks/my-tasks" 
          element={
            <ProtectedRoute>
              <StudentTasks />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="projects" 
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="projects/:id" 
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="teams" 
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="events" 
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admin/memberships" 
          element={
            <ProtectedRoute allowedRoles={['club_admin']}>
              <MembershipAdmin />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="logs" 
          element={
            <ProtectedRoute allowedRoles={['club_admin', 'coordinator']}>
              <ActivityLogs />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
