import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const PersonaLanding = lazy(() => import('../pages/PersonaLanding'));
const MasterLanding = lazy(() => import('../pages/MasterLanding'));

const Dashboard = lazy(() => import('../pages/Dashboard'));
const PaymentsPage = lazy(() => import('../pages/PaymentsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AdminAnalyticsPage = lazy(() => import('../pages/AdminAnalyticsPage'));
const LeaseAgreement = lazy(() => import('../components/property/LeaseAgreement'));
const ListingPage = lazy(() => import('../pages/ListingPage'));
const PropertiesPage = lazy(() => import('../pages/PropertiesPage'));
const ServiceRequestsPage = lazy(() => import('../pages/ServiceRequestsPage'));
const AdminEntitiesPage = lazy(() => import('../pages/AdminEntitiesPage'));
const AdminAssetsPage = lazy(() => import('../pages/AdminAssetsPage'));
const AuditVaultPage = lazy(() => import('../pages/AuditVaultPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  const role = user?.role?.toLowerCase();
  
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    toast.error("Access Denied");
    return <Navigate to={`/home`} replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<MasterLanding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/welcome/:role" element={<PersonaLanding />} />
          <Route path="/listings" element={<ListingPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          
          {['/dashboard', '/tenant-dashboard', '/owner-dashboard', '/inspector-dashboard', '/service-dashboard', '/admin-dashboard'].map((path) => (
            <Route 
              key={path}
              path={path} 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          ))}
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/analytics" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAnalyticsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payments" 
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/lease" 
            element={
              <ProtectedRoute>
                <LeaseAgreement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/service-requests" 
            element={
              <ProtectedRoute>
                <ServiceRequestsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/entities" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEntitiesPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/assets" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAssetsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/audit-vault" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AuditVaultPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

