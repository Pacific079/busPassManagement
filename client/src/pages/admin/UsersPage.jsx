import React, { useMemo, useState, useEffect } from 'react';
import { getAllUsers } from '../../api/admin.api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const UsersPage = () => {
  const [data, setData]       = useState({ users: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [query, setQuery]     = useState('');

  useEffect(() => {
    setLoading(true);
    getAllUsers({ page, limit: 15 })
      .then(setData)
      .catch(() => toast.error('Failed to load users.'))
      .finally(() => setLoading(false));
  }, [page]);

  const users = data.users || [];
  const { total, pages } = data.pagination || {};
  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => {
      const city = u.address?.city || '';
      const state = u.address?.state || '';
      const status = u.isActive ? 'active' : 'inactive';
      const hay = `${u.name || ''} ${u.email || ''} ${u.phone || ''} ${city} ${state} ${status}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, users]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Registered Users</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users…"
            style={{ width: 260 }}
          />
          <span className="total-count">{total} total users</span>
        </div>
      </div>

      {loading ? <div className="loading-text">Loading...</div> : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Contact</th><th>Address</th><th>Status</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No users found.</td></tr>
                ) : filteredUsers.map((u, i) => (
                  <tr key={u._id}>
                    <td style={{ color: '#94a3b8' }}>{(page - 1) * 15 + i + 1}</td>
                    <td>
                      <div className="user-avatar-sm">{u.name?.charAt(0).toUpperCase()}</div>
                      <div style={{ display: 'inline-block', marginLeft: 8 }}>
                        <strong>{u.name}</strong>
                        {u.gender && <div style={{ fontSize: 12, color: '#64748b' }}>{u.gender}</div>}
                      </div>
                    </td>
                    <td>
                      <div>{u.email}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{u.phone}</div>
                    </td>
                    <td style={{ fontSize: 13, color: '#64748b' }}>
                      {[u.address?.city, u.address?.state].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td>
                      <span style={{ background: u.isActive ? '#d1fae5' : '#fee2e2', color: u.isActive ? '#065f46' : '#991b1b', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{format(new Date(u.createdAt), 'dd MMM yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="page-btn">← Prev</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`page-btn ${n === page ? 'page-btn-active' : ''}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="page-btn">Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
