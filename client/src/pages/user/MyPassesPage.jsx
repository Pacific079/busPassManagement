import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { getMyPasses, renewPass, getPassById } from '../../api/pass.api';
import StatusBadge from '../../components/common/StatusBadge';
import { BusIcon } from '../../components/common/Icons';
import { toast } from 'react-toastify';
import { format, isPast, differenceInDays } from 'date-fns';

const MyPassesPage = () => {
  const [data, setData]         = useState({ passes: [], pagination: {} });
  const [loading, setLoading]   = useState(true);
  const [statusFilter, setFilter] = useState('');
  const [selectedPass, setSelected] = useState(null);
  const [renewing, setRenewing] = useState(false);

  const loadPasses = (status = '') => {
    setLoading(true);
    getMyPasses({ status, limit: 20 })
      .then(setData)
      .catch(() => toast.error('Failed to load passes.'))
      .finally(() => setLoading(false));
  };

  const { passId } = useParams();
  const navigate = useNavigate();

  useEffect(() => { loadPasses(statusFilter); }, [statusFilter]);

  useEffect(() => {
    if (!passId) return;
    const found = data.passes?.find(p => p._id === passId);
    if (found) {
      setSelected(found);
    } else {
      getPassById(passId)
        .then(p => setSelected(p))
        .catch(() => toast.error('Failed to load pass details.'));
    }
  }, [passId, data.passes]);

  const handleRenew = async (passId) => {
    if (!window.confirm('Renew this pass? A new payment will be processed.')) return;
    setRenewing(true);
    try {
      await renewPass(passId, { paymentMethod: 'Mock' });
      toast.success('Renewal submitted! Pending admin approval.');
      loadPasses(statusFilter);
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Renewal failed.');
    } finally {
      setRenewing(false);
    }
  };

  const passes = data.passes || [];

  const expiryInfo = (validTo) => {
    if (!validTo) return null;
    const days = differenceInDays(new Date(validTo), new Date());
    if (days < 0) return { text: 'Expired', color: '#dc2626' };
    if (days <= 7) return { text: `Expires in ${days}d`, color: '#f59e0b' };
    return { text: `${days} days left`, color: '#16a34a' };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Bus Passes</h1>
        <Link to="/apply" className="btn-primary">New Application</Link>
      </div>

      <div className="filter-bar">
        {['', 'Pending', 'Approved', 'Rejected', 'Expired', 'Renewed'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`filter-btn ${statusFilter === s ? 'filter-btn-active' : ''}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading && <div className="loading-text">Loading passes...</div>}

      {!loading && passes.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}><BusIcon size={64} /></div>
          <h3>No passes found</h3>
          <p>{statusFilter ? `No ${statusFilter} passes.` : "You haven't applied for any passes yet."}</p>
          <Link to="/apply" className="btn-primary">Apply Now</Link>
        </div>
      )}

      <div className="passes-grid">
        {passes.map(pass => {
          const expiry = pass.validTo ? expiryInfo(pass.validTo) : null;
          return (
            <div key={pass._id} className={`pass-card pass-card-${pass.status.toLowerCase()}`}
              onClick={() => navigate(`/my-passes/${pass._id}`)}>
              <div className="pass-card-header">
                <div>
                  <div className="pass-category">{pass.category?.name}</div>
                  {pass.passNumber && <div className="pass-number">#{pass.passNumber}</div>}
                </div>
                <StatusBadge status={pass.status} />
              </div>

              <div className="pass-route">
                {pass.route?.routeNumber} — {pass.route?.routeName}
              </div>

              <div className="pass-dates">
                <span>Applied: {format(new Date(pass.createdAt), 'dd MMM yyyy')}</span>
                {pass.validTo && (
                  <span style={{ color: expiry?.color }}>
                    {expiry?.text}
                  </span>
                )}
              </div>

              <div className="pass-card-footer">
                <span className="pass-amount">₹{pass.payment?.amount || '—'}</span>
                <span className="pass-view-btn">View Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPass && (
        <div className="modal-overlay" onClick={() => { setSelected(null); navigate('/my-passes'); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setSelected(null); navigate('/my-passes'); }}>✕</button>
            <h2>Pass Details</h2>

            <div className="detail-grid">
              <div><label>Pass Number</label><strong>{selectedPass.passNumber || 'Not assigned'}</strong></div>
              <div><label>Status</label><StatusBadge status={selectedPass.status} /></div>
              <div><label>Category</label><strong>{selectedPass.category?.name}</strong></div>
              <div><label>Route</label><strong>{selectedPass.route?.routeNumber} — {selectedPass.route?.routeName}</strong></div>
              <div><label>Applied On</label><strong>{format(new Date(selectedPass.createdAt), 'dd MMM yyyy')}</strong></div>
              {selectedPass.validFrom && <div><label>Valid From</label><strong>{format(new Date(selectedPass.validFrom), 'dd MMM yyyy')}</strong></div>}
              {selectedPass.validTo && <div><label>Valid Until</label><strong>{format(new Date(selectedPass.validTo), 'dd MMM yyyy')}</strong></div>}
              {selectedPass.payment && <div><label>Payment</label><strong>₹{selectedPass.payment.amount} ({selectedPass.payment.status})</strong></div>}
              {selectedPass.rejectionReason && <div className="full-col"><label>Rejection Reason</label><strong style={{ color: '#dc2626' }}>{selectedPass.rejectionReason}</strong></div>}
            </div>

            {selectedPass.status === 'Approved' && selectedPass.passNumber && (
              <div className="qr-section">
                <h3>Digital Pass QR Code</h3>
                <div className="qr-wrapper">
                  <QRCode
                    value={JSON.stringify({
                      passNumber: selectedPass.passNumber,
                      holder: selectedPass.user?.name || 'Pass Holder',
                      validTo: selectedPass.validTo,
                    })}
                    size={180} fgColor="var(--primary)"
                  />
                </div>
                <p className="qr-hint">Show this QR to the conductor for verification</p>
              </div>
            )}

            <div className="modal-actions">
              {['Approved', 'Expired'].includes(selectedPass.status) && (
                <button className="btn-warning" onClick={() => handleRenew(selectedPass._id)} disabled={renewing}>
                  {renewing ? 'Processing...' : 'Renew Pass'}
                </button>
              )}
              <button className="btn-ghost" onClick={() => { setSelected(null); navigate('/my-passes'); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPassesPage;
