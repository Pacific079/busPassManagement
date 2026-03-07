import React, { useState, useEffect } from 'react';
import { getAllPayments } from '../../api/admin.api';
import StatusBadge from '../../components/common/StatusBadge';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const PaymentsPage = () => {
  const [data, setData]       = useState({ payments: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState('');
  const [page, setPage]       = useState(1);

  useEffect(() => {
    setLoading(true);
    getAllPayments({ status, page, limit: 15 })
      .then(setData)
      .catch(() => toast.error('Failed to load payments.'))
      .finally(() => setLoading(false));
  }, [status, page]);

  const payments = data.payments || [];
  const { pages } = data.pagination || {};
  const totalAmount = payments.filter(p => p.status === 'Success').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="page-container">
      <h1 className="page-title">Payment Records</h1>

      <div className="summary-bar">
        <div className="summary-bar-item">
          <span>Total on page</span><strong>{payments.length} records</strong>
        </div>
        <div className="summary-bar-item">
          <span>Successful amount</span><strong style={{ color: '#059669' }}>₹{totalAmount.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      <div className="filter-bar">
        {['', 'Success', 'Pending', 'Failed', 'Refunded'].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`filter-btn ${status === s ? 'filter-btn-active' : ''}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <div className="loading-text">Loading payments...</div> : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>Transaction ID</th><th>User</th><th>Pass</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No payments found.</td></tr>
                ) : payments.map(p => (
                  <tr key={p._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.transactionId}</td>
                    <td>
                      <div><strong>{p.user?.name}</strong></div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{p.user?.email}</div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--primary)' }}>{p.pass?.passNumber || '—'}</td>
                    <td><strong>₹{p.amount?.toLocaleString('en-IN')}</strong></td>
                    <td>{p.method}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td style={{ fontSize: 13 }}>
                      {p.paidAt ? format(new Date(p.paidAt), 'dd MMM yyyy, HH:mm') : format(new Date(p.createdAt), 'dd MMM yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="page-btn">← Prev</button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(n => (
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

export default PaymentsPage;
