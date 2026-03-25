import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../api/admin.api';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import { BusIcon, CheckIcon, DashboardIcon, AddIcon, UserIcon, RefreshIcon } from '../../components/common/Icons';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const AdminDashboard = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container loading-text">Loading dashboard...</div>;
  if (!data)   return <div className="page-container">Failed to load dashboard.</div>;

  const { stats, recentApplications, monthlyStats } = data;

  const chartData = (monthlyStats || []).map(m => ({
    name: MONTH_NAMES[(m._id.month || 1) - 1],
    Applications: m.count,
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>Overview of the Bus Pass Management System</p>
        </div>
        <Link to="/admin/applications?status=Pending" className="btn-warning">
          Review Pending ({stats.pendingPasses})
        </Link>
      </div>

      <div className="stats-grid stats-grid-5">
        <StatsCard icon={<UserIcon />} label="Total Users"      value={stats.totalUsers}     color="var(--primary)" bg="var(--primary-lt)" />
        <StatsCard icon={<BusIcon />} label="Total Passes"     value={stats.totalPasses}    color="var(--accent)" bg="#fff7ed" />
        <StatsCard icon={<RefreshIcon />} label="Pending Review"   value={stats.pendingPasses}  color="var(--warning)" bg="#fff7ed" />
        <StatsCard icon={<CheckIcon />} label="Approved Passes"  value={stats.approvedPasses} color="var(--success)" bg="#d1fae5" />
        <StatsCard icon={<div style={{fontSize:20,fontWeight:700}}>₹</div>} label="Total Revenue"    value={`₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`} color="var(--primary)" bg="var(--primary-lt)" />
      </div>

      <div className="dashboard-cols">
        <div className="card chart-card">
          <h3 className="card-title">Monthly Applications</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Applications" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-chart">No data yet</div>}
        </div>

        <div className="card">
          <h3 className="card-title">Pass Status Breakdown</h3>
          {[
            { label: 'Approved', value: stats.approvedPasses, color: 'var(--success)', bg: '#d1fae5' },
            { label: 'Pending',  value: stats.pendingPasses,  color: 'var(--warning)', bg: '#fff7ed' },
            { label: 'Rejected', value: stats.rejectedPasses, color: 'var(--danger)', bg: '#fee2e2' },
          ].map(s => (
            <div key={s.label} className="status-breakdown-row">
              <div className="status-breakdown-label">
                <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                  {s.label}
                </span>
              </div>
              <div className="progress-bar-outer">
                <div className="progress-bar-inner" style={{
                  width: `${stats.totalPasses ? (s.value / stats.totalPasses * 100) : 0}%`,
                  background: s.color,
                }} />
              </div>
              <strong>{s.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header-row">
          <h3 className="card-title">Recent Applications</h3>
          <Link to="/admin/applications" className="link-sm">View all →</Link>
        </div>
        {recentApplications?.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant</th><th>Category</th><th>Status</th>
                  <th>Applied On</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map(app => (
                  <tr key={app._id}>
                    <td>
                      <div><strong>{app.user?.name}</strong></div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{app.user?.email}</div>
                    </td>
                    <td>{app.category?.name}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>{format(new Date(app.createdAt), 'dd MMM yyyy')}</td>
                    <td><Link to={`/admin/applications`} className="link-sm">Review →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty-state-sm">No applications yet.</div>}
      </div>

      
      <div className="admin-quick-links">
        {[
          { to: '/admin/applications', icon: <DashboardIcon />, label: 'Applications', color: '#1E3A8A' },
          { to: '/admin/routes',       icon: <BusIcon />, label: 'Routes',       color: '#16A34A' },
          { to: '/admin/categories',   icon: <AddIcon />, label: 'Categories',  color: 'var(--accent)' },
          { to: '/admin/payments',     icon: <RefreshIcon />, label: 'Payments',    color: '#F59E0B' },
          { to: '/admin/users',        icon: <UserIcon />, label: 'Users',       color: '#DC2626' },
          { to: '/admin/report',       icon: <DashboardIcon />, label: 'Report', color: '#7C3AED' },
        ].map(l => (
          <Link key={l.to} to={l.to} className="quick-action-card" style={{ borderTopColor: l.color }}>
            <span className="quick-action-icon" style={{ color: l.color }}>{l.icon}</span>
            <strong style={{ color: l.color }}>{l.label}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
