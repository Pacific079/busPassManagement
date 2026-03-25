import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getAllUsers,
  getApplications,
  getAllPayments,
  getAdminCategories,
  getAdminRoutes,
} from '../../api/admin.api';
import { downloadSystemReportPDF } from '../../utils/downloadSystemReport';

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      try {
        const [usersRes, passesRes, paymentsRes, categories, routes] = await Promise.all([
          getAllUsers({ page: 1, limit: 10000 }),
          getApplications({ page: 1, limit: 10000 }),
          getAllPayments({ page: 1, limit: 10000 }),
          getAdminCategories(),
          getAdminRoutes(),
        ]);

        const users = usersRes?.users || [];
        const passes = passesRes?.passes || [];
        const payments = paymentsRes?.payments || [];

        const stats = {
          users: users.length,
          passes: passes.length,
          payments: payments.length,
          categories: (categories || []).length,
          routes: (routes || []).length,
          approvedPasses: passes.filter((p) => p.status === 'Approved').length,
          pendingPasses: passes.filter((p) => p.status === 'Pending').length,
          successfulPayments: payments.filter((p) => p.status === 'Success').length,
          totalRevenue: payments
            .filter((p) => p.status === 'Success')
            .reduce((sum, p) => sum + (p.amount || 0), 0),
        };

        setReport({
          generatedAt: new Date().toISOString(),
          stats,
          users,
          passes,
          payments,
          categories: categories || [],
          routes: routes || [],
        });
      } catch (e) {
        toast.error('Failed to load report data.');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const q = query.trim().toLowerCase();

  const inDateRange = useCallback((value) => {
    if (!dateFrom && !dateTo) return true;
    if (!value) return false;
    const t = new Date(value).getTime();
    if (Number.isNaN(t)) return false;
    if (dateFrom) {
      const start = new Date(`${dateFrom}T00:00:00.000`).getTime();
      if (t < start) return false;
    }
    if (dateTo) {
      const end = new Date(`${dateTo}T23:59:59.999`).getTime();
      if (t > end) return false;
    }
    return true;
  }, [dateFrom, dateTo]);

  const filteredUsers = useMemo(() => {
    const rows = [...(report?.users || [])].filter((u) => {
      if (!inDateRange(u.createdAt)) return false;
      if (!q) return true;
      return `${u.name || ''} ${u.email || ''} ${u.phone || ''} ${u.isActive ? 'active' : 'inactive'}`
        .toLowerCase()
        .includes(q);
    });

    rows.sort((a, b) => {
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return sortBy === 'dateAsc' ? aDate - bDate : bDate - aDate;
    });
    return rows;
  }, [report, q, sortBy, inDateRange]);

  const filteredPasses = useMemo(() => {
    const rows = [...(report?.passes || [])].filter((p) => {
      if (!inDateRange(p.createdAt)) return false;
      if (!q) return true;
      return `${p.passNumber || ''} ${p.user?.name || ''} ${p.category?.name || ''} ${p.route?.routeNumber || ''} ${p.route?.routeName || ''} ${p.status || ''}`
        .toLowerCase()
        .includes(q);
    });

    rows.sort((a, b) => {
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return sortBy === 'dateAsc' ? aDate - bDate : bDate - aDate;
    });
    return rows;
  }, [report, q, sortBy, inDateRange]);

  const filteredPayments = useMemo(() => {
    const rows = [...(report?.payments || [])].filter((p) => {
      const payDate = p.paidAt || p.createdAt;
      if (!inDateRange(payDate)) return false;
      if (!q) return true;
      return `${p.transactionId || ''} ${p.user?.name || ''} ${p.pass?.passNumber || ''} ${p.status || ''} ${p.amount || 0}`
        .toLowerCase()
        .includes(q);
    });

    rows.sort((a, b) => {
      if (sortBy === 'paymentDesc') return (b.amount || 0) - (a.amount || 0);
      if (sortBy === 'paymentAsc') return (a.amount || 0) - (b.amount || 0);
      const aDate = new Date(a.paidAt || a.createdAt || 0).getTime();
      const bDate = new Date(b.paidAt || b.createdAt || 0).getTime();
      return sortBy === 'dateAsc' ? aDate - bDate : bDate - aDate;
    });
    return rows;
  }, [report, q, sortBy, inDateRange]);

  const filteredCategories = useMemo(() => {
    const rows = [...(report?.categories || [])].filter((c) => {
      if (!q) return true;
      return `${c.name || ''} ${c.price || 0} ${c.duration || 0} ${c.discount || 0} ${c.isActive ? 'active' : 'inactive'}`
        .toLowerCase()
        .includes(q);
    });
    return rows;
  }, [report, q]);

  const filteredRoutes = useMemo(() => {
    const rows = [...(report?.routes || [])].filter((r) => {
      if (!q) return true;
      return `${r.routeNumber || ''} ${r.routeName || ''} ${r.startPoint || ''} ${r.endPoint || ''} ${r.fare || 0} ${r.isActive ? 'active' : 'inactive'}`
        .toLowerCase()
        .includes(q);
    });
    return rows;
  }, [report, q]);

  const summaryItems = useMemo(() => {
    if (!report) return [];
    const approvedPasses = filteredPasses.filter((p) => p.status === 'Approved').length;
    const pendingPasses = filteredPasses.filter((p) => p.status === 'Pending').length;
    const successfulPayments = filteredPayments.filter((p) => p.status === 'Success').length;
    const totalRevenue = filteredPayments
      .filter((p) => p.status === 'Success')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    return [
      ['Users', filteredUsers.length],
      ['Passes', filteredPasses.length],
      ['Payments', filteredPayments.length],
      ['Categories', filteredCategories.length],
      ['Routes', filteredRoutes.length],
      ['Approved Passes', approvedPasses],
      ['Pending Passes', pendingPasses],
      ['Successful Payments', successfulPayments],
      ['Total Revenue', `₹${totalRevenue.toLocaleString('en-IN')}`],
    ];
  }, [report, filteredUsers, filteredPasses, filteredPayments, filteredCategories, filteredRoutes]);

  const filteredReportForPdf = useMemo(() => {
    if (!report) return null;
    const approvedPasses = filteredPasses.filter((p) => p.status === 'Approved').length;
    const pendingPasses = filteredPasses.filter((p) => p.status === 'Pending').length;
    const successfulPayments = filteredPayments.filter((p) => p.status === 'Success').length;
    const totalRevenue = filteredPayments
      .filter((p) => p.status === 'Success')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    return {
      generatedAt: new Date().toISOString(),
      stats: {
        users: filteredUsers.length,
        passes: filteredPasses.length,
        payments: filteredPayments.length,
        categories: filteredCategories.length,
        routes: filteredRoutes.length,
        approvedPasses,
        pendingPasses,
        successfulPayments,
        totalRevenue,
      },
      users: filteredUsers,
      passes: filteredPasses,
      payments: filteredPayments,
      categories: filteredCategories,
      routes: filteredRoutes,
    };
  }, [report, filteredUsers, filteredPasses, filteredPayments, filteredCategories, filteredRoutes]);

  if (loading) return <div className="page-container loading-text">Loading system report...</div>;
  if (!report) return <div className="page-container">Failed to load report.</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Report</h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>
            Full data snapshot across users, passes, payments, categories and routes.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => filteredReportForPdf && downloadSystemReportPDF(filteredReportForPdf)}
        >
          Download PDF
        </button>
      </div>

      <div className="summary-bar">
        {summaryItems.map(([label, value]) => (
          <div key={label} className="summary-bar-item">
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="form-input"
            placeholder="Search report data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 360 }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
            From
            <input
              type="date"
              className="form-input"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{ width: 'auto', minWidth: 150 }}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
            To
            <input
              type="date"
              className="form-input"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{ width: 'auto', minWidth: 150 }}
            />
          </label>
          {(dateFrom || dateTo) && (
            <button type="button" className="btn-ghost" onClick={() => { setDateFrom(''); setDateTo(''); }}>
              Clear dates
            </button>
          )}
          <select
            className="form-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ maxWidth: 260 }}
          >
            <option value="dateDesc">Date/Time: Newest First</option>
            <option value="dateAsc">Date/Time: Oldest First</option>
            <option value="paymentDesc">Payment: High to Low</option>
            <option value="paymentAsc">Payment: Low to High</option>
          </select>
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
          Date range applies to users (joined), passes (applied), and payments (paid or created). Categories and routes use search only.
        </p>
      </div>

      <div className="card">
        <div className="card-header-row">
          <h3 className="card-title">Users ({filteredUsers.length})</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Passes ({filteredPasses.length})</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Pass No.</th><th>User</th><th>Category</th><th>Route</th><th>Status</th><th>Applied</th></tr>
            </thead>
            <tbody>
              {filteredPasses.map((p) => (
                <tr key={p._id}>
                  <td>{p.passNumber || '-'}</td>
                  <td>{p.user?.name || '-'}</td>
                  <td>{p.category?.name || '-'}</td>
                  <td>{p.route ? `${p.route.routeNumber} - ${p.route.routeName}` : '-'}</td>
                  <td>{p.status}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Payments ({filteredPayments.length})</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Txn ID</th><th>User</th><th>Pass</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p._id}>
                  <td>{p.transactionId || '-'}</td>
                  <td>{p.user?.name || '-'}</td>
                  <td>{p.pass?.passNumber || '-'}</td>
                  <td>₹{(p.amount || 0).toLocaleString('en-IN')}</td>
                  <td>{p.status}</td>
                  <td>{new Date(p.paidAt || p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Categories ({filteredCategories.length})</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Price</th><th>Duration</th><th>Discount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filteredCategories.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>₹{(c.price || 0).toLocaleString('en-IN')}</td>
                  <td>{c.duration} days</td>
                  <td>{c.discount || 0}%</td>
                  <td>{c.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Routes ({filteredRoutes.length})</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Route No.</th><th>Name</th><th>From</th><th>To</th><th>Fare</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filteredRoutes.map((r) => (
                <tr key={r._id}>
                  <td>{r.routeNumber}</td>
                  <td>{r.routeName}</td>
                  <td>{r.startPoint}</td>
                  <td>{r.endPoint}</td>
                  <td>₹{(r.fare || 0).toLocaleString('en-IN')}</td>
                  <td>{r.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
