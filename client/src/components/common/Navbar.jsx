import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BusIcon } from './Icons';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path) ? 'nav-link-active' : '';

  const userLinks = [
    { to: '/dashboard',  label: 'Dashboard' },
    { to: '/apply',      label: 'Apply Pass' },
    { to: '/my-passes',  label: 'My Passes' },
    { to: '/profile',    label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin',                  label: 'Dashboard' },
    { to: '/admin/applications',     label: 'Applications' },
    { to: '/admin/routes',           label: 'Routes' },
    { to: '/admin/categories',       label: 'Categories' },
    { to: '/admin/payments',         label: 'Payments' },
    { to: '/admin/users',            label: 'Users' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="brand-link">
          <BusIcon size={22} style={{ marginRight: 8 }} /> 
          <span>SafarPass</span>
          {isAdmin && <span className="admin-badge">Admin</span>}
        </Link>
      </div>

     
      <div className="navbar-links desktop-only center-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to)}`}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className="navbar-right desktop-only">
        <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>

      <button className="mobile-toggle" onClick={() => setMobileOpen(o => !o)}>
        {mobileOpen ? '✕' : '☰'}
      </button>

      {mobileOpen && (
        <div className="mobile-menu">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="mobile-link" onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
          <hr style={{ borderColor: '#3b82f6', margin: '8px 0' }} />
          <span className="mobile-user">Hi, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout-mobile">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
