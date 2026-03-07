import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyPasses } from '../../api/pass.api';
import { BusIcon, CheckIcon, AddIcon, UserIcon, RefreshIcon, DashboardIcon } from '../../components/common/Icons';
import { useAuth } from '../../context/AuthContext';

import StatusBadge from '../../components/common/StatusBadge';
import StatsCard from '../../components/common/StatsCard';
import { format } from 'date-fns';


const UserDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ passes: [], pagination: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPasses({ limit: 5 })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const passes = data.passes || [];
  const stats = {
    total:    passes.length,
    approved: passes.filter(p => p.status === 'Approved').length,
    pending:  passes.filter(p => p.status === 'Pending').length,
    expired:  passes.filter(p => p.status === 'Expired').length,
  };

  const activePass = passes.find(p => p.status === 'Approved');

  return (
    <div className="page-container">
      <div className="welcome-banner">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p>Manage your bus passes quickly and easily</p>
        </div>
        <Link to="/apply" className="btn-primary">
          Apply New Pass
        </Link>
      </div>

      <div className="stats-grid">
        <StatsCard icon={<BusIcon />} label="Total Passes"    value={data.pagination?.total || stats.total} color="var(--accent)" bg="#fff7ed" />
        <StatsCard icon={<CheckIcon />} label="Active Passes"   value={stats.approved} color="var(--success)" bg="#d1fae5" />
        <StatsCard icon={<RefreshIcon />} label="Pending Review"  value={stats.pending}  color="var(--warning)" bg="#fff7ed" />
        <StatsCard icon={<div style={{fontSize:20,fontWeight:700}}>⌛</div>} label="Expired Passes"  value={stats.expired}  color="var(--danger)" bg="#fde8e8" />
      </div>

      {activePass && (
        <div className="active-pass-card">
          <div className="active-pass-header">
            <span>Active Bus Pass</span>
            <StatusBadge status="Approved" />
          </div>
          <div className="active-pass-body">
            <div className="pass-info-grid">
              <div><label>Pass Number</label><strong>{activePass.passNumber || '—'}</strong></div>
              <div><label>Category</label><strong>{activePass.category?.name}</strong></div>
              <div><label>Route</label><strong>{activePass.route?.routeNumber} – {activePass.route?.routeName}</strong></div>
              <div><label>Valid Until</label><strong style={{ color: 'var(--success)' }}>
                {activePass.validTo ? format(new Date(activePass.validTo), 'dd MMM yyyy') : '—'}
              </strong></div>
            </div>
            <Link to={`/my-passes/${activePass._id}`} className="btn-outline" style={{ marginTop: 12 }}>
              View & Download
            </Link>
          </div>
        </div>
      )}

      <div className="section-title">Quick Actions</div>
      <div className="quick-actions-grid">
        {[
          { icon: <AddIcon />, label: 'Apply Pass', desc: 'Submit a new application', to: '/apply', color: '#1E3A8A' },
          { icon: <BusIcon />, label: 'My Passes',  desc: 'View all your passes',    to: '/my-passes', color: '#16A34A' },
          { icon: <RefreshIcon />, label: 'Renew Pass', desc: 'Renew an existing pass',  to: '/my-passes', color: '#F59E0B' },
          { icon: <UserIcon />, label: 'Profile',    desc: 'Update your details',     to: '/profile', color: 'var(--primary)' },
        ].map(a => (
          <Link key={a.to} to={a.to} className="quick-action-card" style={{ borderTopColor: a.color }}>
            <span className="quick-action-icon">{a.icon}</span>
            <strong style={{ color: a.color }}>{a.label}</strong>
            <p>{a.desc}</p>
          </Link>
        ))}
      </div>

      {passes.length > 0 && (
        <>
          <div className="section-header">
            <div className="section-title">Recent Applications</div>
            <Link to="/my-passes" className="link-sm">View all →</Link>
          </div>
          {loading ? <div className="loading-text">Loading...</div> : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th><th>Route</th><th>Status</th>
                    <th>Applied On</th><th>Valid Until</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {passes.map(p => (
                    <tr key={p._id}>
                      <td><strong>{p.category?.name}</strong></td>
                      <td>{p.route?.routeNumber} – {p.route?.routeName}</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td>{format(new Date(p.createdAt), 'dd MMM yyyy')}</td>
                      <td>{p.validTo ? format(new Date(p.validTo), 'dd MMM yyyy') : '—'}</td>
                      <td><Link to={`/my-passes/${p._id}`} className="link-sm">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {passes.length === 0 && !loading && (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}><BusIcon size={64} /></div>
          <h3>No passes yet</h3>
          <p>Apply for your first bus pass to get started!</p>
          <Link to="/apply" className="btn-primary">Apply Now</Link>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
