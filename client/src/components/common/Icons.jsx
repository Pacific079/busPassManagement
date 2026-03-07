import React from 'react';

export const BusIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <circle cx="7" cy="18" r="1.6" fill="currentColor" />
    <circle cx="17" cy="18" r="1.6" fill="currentColor" />
    <rect x="4" y="8" width="4" height="4" fill="currentColor" opacity="0.08" />
  </svg>
);

export const LockIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M8 10V8a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const EyeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
);

export const EyeOffIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M17.94 17.94C16.06 19.02 14.06 19.6 12 19.6c-6 0-10-7-10-7a20.6 20.6 0 014.1-4.79" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
);

export const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const CrossIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const AddIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const UserIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const RefreshIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 19a9 9 0 0114-7.464" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const DocumentIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 10h6M9 14h6M9 18h6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const DashboardIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
