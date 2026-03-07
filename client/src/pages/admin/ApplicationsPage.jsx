import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getApplications, approveApplication, rejectApplication } from '../../api/admin.api';
import StatusBadge from '../../components/common/StatusBadge';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ApplicationsPage = () => {
  const [searchParams] = useSearchParams();
  const [data, setData]       = useState({ passes: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState(searchParams.get('status') || '');
  const [page, setPage]       = useState(1);
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = () => {
    setLoading(true);
    getApplications({ status, page, limit: 10 })
      .then(setData)
      .catch(() => toast.error('Failed to load applications.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status, page]);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this pass application?')) return;
    setActionLoading(true);
    try {
      await approveApplication(id);
      toast.success('Pass approved! Email notification sent.');
      load();
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) return toast.error('Please provide a rejection reason.');
    setActionLoading(true);
    try {
      await rejectApplication(id, rejectReason);
      toast.success('Pass rejected. Applicant will be notified.');
      load();
      setSelected(null);
      setRejectReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const passes = data.passes || [];
  const { total, pages } = data.pagination || {};

  return (
    <div className="page-container">
      <h1 className="page-title">Pass Applications</h1>

      <div className="filter-bar">
        {['', 'Pending', 'Approved', 'Rejected', 'Expired'].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`filter-btn ${status === s ? 'filter-btn-active' : ''}`}>
            {s || 'All'}
          </button>
        ))}
        {total !== undefined && <span className="total-count">{total} total</span>}
      </div>

      {loading && <div className="loading-text">Loading...</div>}

      {!loading && (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant</th><th>Category</th><th>Route</th>
                  <th>Status</th><th>Applied</th><th>Payment</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passes.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No applications found.</td></tr>
                ) : passes.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div><strong>{p.user?.name}</strong></div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{p.user?.email}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{p.user?.phone}</div>
                    </td>
                    <td>{p.category?.name}</td>
                    <td>{p.route?.routeNumber}<br /><span style={{ fontSize: 12, color: '#64748b' }}>{p.route?.routeName}</span></td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>{format(new Date(p.createdAt), 'dd MMM yyyy')}</td>
                    <td>
                      {p.payment ? (
                        <span style={{ color: '#16a34a', fontWeight: 600 }}>₹{p.payment.amount}<br />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.payment.status}</span>
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button className="btn-sm btn-outline" onClick={() => setSelected(p)}>View</button>
                        {p.status === 'Pending' && (
                          <>
                            <button className="btn-sm btn-success" onClick={() => handleApprove(p._id)} disabled={actionLoading}>Approve</button>
                            <button className="btn-sm btn-danger" onClick={() => setSelected({ ...p, rejecting: true })} disabled={actionLoading}>Reject</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="page-btn">← Prev</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`page-btn ${n === page ? 'page-btn-active' : ''}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="page-btn">Next →</button>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => { setSelected(null); setRejectReason(''); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setSelected(null); setRejectReason(''); }}>✕</button>
            <h2>{selected.rejecting ? 'Reject Application' : 'Application Detail'}</h2>

            {!selected.rejecting ? (
              <>
                <div className="detail-grid">
                  <div><label>Applicant</label><strong>{selected.user?.name}</strong></div>
                  <div><label>Email</label><strong>{selected.user?.email}</strong></div>
                  <div><label>Phone</label><strong>{selected.user?.phone}</strong></div>
                  <div><label>Category</label><strong>{selected.category?.name}</strong></div>
                  <div><label>Route</label><strong>{selected.route?.routeNumber} — {selected.route?.routeName}</strong></div>
                  <div><label>Status</label><StatusBadge status={selected.status} /></div>
                  <div><label>Applied</label><strong>{format(new Date(selected.createdAt), 'dd MMM yyyy, HH:mm')}</strong></div>
                  {selected.payment && <div><label>Payment</label><strong>₹{selected.payment.amount} ({selected.payment.transactionId})</strong></div>}
                  {selected.rejectionReason && <div className="full-col"><label>Rejection Reason</label><strong style={{ color: '#dc2626' }}>{selected.rejectionReason}</strong></div>}
                </div>

                {selected.documents?.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <label>Uploaded Documents</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      {selected.documents.map((doc, i) => (
                        <a key={i} href={`/${doc.filePath}`} target="_blank" rel="noreferrer"
                          className="doc-link">{doc.docType}</a>
                      ))}
                    </div>
                  </div>
                )}

                {selected.status === 'Pending' && (
                  <div className="modal-actions">
                    <button className="btn-success" onClick={() => handleApprove(selected._id)} disabled={actionLoading}>
                      {actionLoading ? 'Processing...' : 'Approve Pass'}
                    </button>
                    <button className="btn-danger" onClick={() => setSelected(s => ({ ...s, rejecting: true }))}>
                      Reject Pass
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <p style={{ color: '#64748b' }}>You are about to reject <strong>{selected.user?.name}</strong>'s application. Please provide a clear reason.</p>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label>Rejection Reason *</label>
                  <textarea
                    className="form-input" rows={4} value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="e.g., Documents are unclear or invalid. Please resubmit with valid ID proof."
                  />
                </div>
                <div className="modal-actions">
                  <button className="btn-danger" onClick={() => handleReject(selected._id)} disabled={actionLoading || !rejectReason.trim()}>
                    {actionLoading ? 'Processing...' : 'Confirm Rejection'}
                  </button>
                  <button className="btn-ghost" onClick={() => setSelected(s => ({ ...s, rejecting: false }))}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
