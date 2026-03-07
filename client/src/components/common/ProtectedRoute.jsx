import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Spinner = () => (
  <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f4f8' }}>
    <div style={{ textAlign:'center' }}>
      <div className="spinner-border-lg" style={{
        width:48, height:48, border:'4px solid var(--primary-lt)', borderTopColor:'var(--primary)',
        borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px'
      }}/>
      <p style={{ color:'#64748b', fontWeight:500 }}>Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!user)   return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
