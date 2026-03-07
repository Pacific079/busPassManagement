import React from 'react';

const StatsCard = ({ icon, label, value, color = 'var(--primary)', bg = 'var(--primary-lt)' }) => (
  <div style={{
    background: '#fff', borderRadius: 'var(--radius)', padding: '20px 24px',
    boxShadow: 'var(--shadow)', display: 'flex',
    alignItems: 'center', gap: 16,
    transition: 'transform 0.2s, box-shadow 0.2s',
  }} className="stats-card">
    <div style={{
      width: 52, height: 52, borderRadius: 'var(--radius)', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 24, flexShrink: 0, color: color,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{value ?? '—'}</div>
    </div>
  </div>
);

export default StatsCard;
