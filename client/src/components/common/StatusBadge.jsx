import React from 'react';

const STATUS_MAP = {
  Pending:  { bg: '#fff7ed', color: '#f59e0b', label: 'Pending' },
  Approved: { bg: '#d1fae5', color: '#16a34a', label: 'Approved' },
  Rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
  Expired:  { bg: '#fde8e8', color: '#dc2626', label: 'Expired' },
  Renewed:  { bg: '#e0e7ff', color: '#1e3a8a', label: 'Renewed' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || { bg: '#f1f5f9', color: '#64748b', label: status };
  return (
    <span style={{
      background: s.bg, color: s.color, padding: '4px 10px',
      borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
};

export default StatusBadge;
