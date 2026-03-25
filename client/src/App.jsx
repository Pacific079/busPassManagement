import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

// Public pages
import LoginPage    from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import ApplyPassPage from './pages/user/ApplyPassPage';
import MyPassesPage  from './pages/user/MyPassesPage';
import ProfilePage   from './pages/user/ProfilePage';

// Admin pages
import AdminDashboard    from './pages/admin/AdminDashboard';
import ApplicationsPage  from './pages/admin/ApplicationsPage';
import RoutesPage        from './pages/admin/RoutesPage';
import CategoriesPage    from './pages/admin/CategoriesPage';
import PaymentsPage      from './pages/admin/PaymentsPage';
import UsersPage         from './pages/admin/UsersPage';
import ReportPage        from './pages/admin/ReportPage';

import './index.css';
import { BusIcon } from './components/common/Icons';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <div className={user ? 'main-content' : ''}>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          <Route path="/"         element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />

          {/* User routes */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/apply"     element={<ProtectedRoute><ApplyPassPage /></ProtectedRoute>} />
          {/* we accept an optional passId so links like /my-passes/123 open detail modal */}
          <Route path="/my-passes/:passId?" element={<ProtectedRoute><MyPassesPage /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin"                  element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/applications"     element={<ProtectedRoute adminOnly><ApplicationsPage /></ProtectedRoute>} />
          <Route path="/admin/routes"           element={<ProtectedRoute adminOnly><RoutesPage /></ProtectedRoute>} />
          <Route path="/admin/categories"       element={<ProtectedRoute adminOnly><CategoriesPage /></ProtectedRoute>} />
          <Route path="/admin/payments"         element={<ProtectedRoute adminOnly><PaymentsPage /></ProtectedRoute>} />
          <Route path="/admin/users"            element={<ProtectedRoute adminOnly><UsersPage /></ProtectedRoute>} />
          <Route path="/admin/report"           element={<ProtectedRoute adminOnly><ReportPage /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 80 }}><BusIcon size={80} /></div>
              <h1>404 — Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <a href="/" style={{ color: 'var(--primary)' }}>Go home</a>
            </div>
          } />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} theme="colored" />
      </Router>
    </AuthProvider>
  );
}

export default App;
