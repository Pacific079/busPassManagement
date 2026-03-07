import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { BusIcon, LockIcon, EyeIcon, EyeOffIcon } from '../../components/common/Icons';

const LoginPage = () => {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields.');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (from) navigate(from, { replace: true });
      else navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <svg className="auth-background" viewBox="0 0 1400 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#0f4c75', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#3282b8', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0f4c75', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="blur"><feGaussianBlur in="SourceGraphic" stdDeviation="2" /></filter>
        </defs>

        <circle cx="1100" cy="120" r="65" fill="#e8d64f" opacity="0.8" />
        <circle cx="1100" cy="120" r="85" fill="#e8d64f" opacity="0.3" />

        <g fill="white" opacity="0.7">
          <ellipse cx="200" cy="100" rx="60" ry="35" />
          <ellipse cx="250" cy="90" rx="45" ry="28" />
          <ellipse cx="150" cy="95" rx="50" ry="32" />
          
          <ellipse cx="800" cy="80" rx="55" ry="33" />
          <ellipse cx="850" cy="75" rx="40" ry="25" />
          <ellipse cx="750" cy="85" rx="48" ry="30" />
          
          <ellipse cx="1250" cy="110" rx="58" ry="34" />
          <ellipse cx="1305" cy="100" rx="42" ry="26" />
          <ellipse cx="1200" cy="110" rx="50" ry="31" />
        </g>

        <rect y="480" width="1400" height="120" fill="#5d7a8f" />

        <g fill="#1a7a5a" opacity="0.9">
          <circle cx="80" cy="460" r="22" />
          <rect x="75" y="460" width="10" height="25" fill="#0d4a33" />
          <circle cx="150" cy="475" r="25" />
          <rect x="144" y="475" width="12" height="28" fill="#0d4a33" />
          <circle cx="220" cy="465" r="20" />
          <rect x="216" y="465" width="8" height="22" fill="#0d4a33" />

          <circle cx="1250" cy="470" r="23" />
          <rect x="1244" y="470" width="12" height="25" fill="#0d4a33" />
          <circle cx="1320" cy="475" r="26" />
          <rect x="1313" y="475" width="14" height="30" fill="#0d4a33" />
        </g>

        <g fill="#7a9bac" opacity="0.6">
          <rect x="100" y="280" width="90" height="200" />
          <rect x="220" y="240" width="80" height="240" />
          <rect x="350" y="310" width="75" height="170" />
          <rect x="480" y="260" width="95" height="220" />
          <rect x="620" y="320" width="85" height="160" />
          <rect x="750" y="290" width="80" height="190" />
          <rect x="900" y="250" width="100" height="230" />
          <rect x="1050" y="310" width="70" height="170" />
          <rect x="1160" y="270" width="90" height="210" />
        </g>

        <g fill="#1b3a52" opacity="0.95">

          <rect x="50" y="320" width="85" height="160" />
          <rect x="60" y="340" width="10" height="12" fill="#5d7a8f" />
          <rect x="75" y="340" width="10" height="12" fill="#5d7a8f" />
          <rect x="60" y="360" width="10" height="12" fill="#5d7a8f" />
          <rect x="75" y="360" width="10" height="12" fill="#5d7a8f" />
          <rect x="60" y="380" width="10" height="12" fill="#5d7a8f" />
          <rect x="75" y="380" width="10" height="12" fill="#5d7a8f" />
          <rect x="60" y="400" width="10" height="12" fill="#5d7a8f" />
          <rect x="75" y="400" width="10" height="12" fill="#5d7a8f" />

          <rect x="170" y="200" width="95" height="280" />
          <polygon points="217.5,200 210,190 225,190" fill="#1b3a52" />
          <rect x="178" y="225" width="12" height="15" fill="#5d7a8f" />
          <rect x="200" y="225" width="12" height="15" fill="#5d7a8f" />
          <rect x="222" y="225" width="12" height="15" fill="#5d7a8f" />
          <rect x="178" y="255" width="12" height="15" fill="#5d7a8f" />
          <rect x="200" y="255" width="12" height="15" fill="#5d7a8f" />
          <rect x="222" y="255" width="12" height="15" fill="#5d7a8f" />
          <rect x="178" y="285" width="12" height="15" fill="#5d7a8f" />
          <rect x="200" y="285" width="12" height="15" fill="#5d7a8f" />
          <rect x="222" y="285" width="12" height="15" fill="#5d7a8f" />
          <rect x="178" y="315" width="12" height="15" fill="#5d7a8f" />
          <rect x="200" y="315" width="12" height="15" fill="#5d7a8f" />
          <rect x="222" y="315" width="12" height="15" fill="#5d7a8f" />
          <rect x="178" y="345" width="12" height="15" fill="#5d7a8f" />
          <rect x="200" y="345" width="12" height="15" fill="#5d7a8f" />
          <rect x="222" y="345" width="12" height="15" fill="#5d7a8f" />

          <rect x="295" y="350" width="80" height="130" />
          <rect x="304" y="370" width="11" height="13" fill="#5d7a8f" />
          <rect x="322" y="370" width="11" height="13" fill="#5d7a8f" />
          <rect x="340" y="370" width="11" height="13" fill="#5d7a8f" />
          <rect x="304" y="395" width="11" height="13" fill="#5d7a8f" />
          <rect x="322" y="395" width="11" height="13" fill="#5d7a8f" />
          <rect x="340" y="395" width="11" height="13" fill="#5d7a8f" />

          <rect x="410" y="300" width="100" height="180" />
          <rect x="420" y="325" width="13" height="15" fill="#5d7a8f" />
          <rect x="442" y="325" width="13" height="15" fill="#5d7a8f" />
          <rect x="464" y="325" width="13" height="15" fill="#5d7a8f" />
          <rect x="420" y="360" width="13" height="15" fill="#5d7a8f" />
          <rect x="442" y="360" width="13" height="15" fill="#5d7a8f" />
          <rect x="464" y="360" width="13" height="15" fill="#5d7a8f" />
          <rect x="420" y="395" width="13" height="15" fill="#5d7a8f" />
          <rect x="442" y="395" width="13" height="15" fill="#5d7a8f" />
          <rect x="464" y="395" width="13" height="15" fill="#5d7a8f" />

          <rect x="550" y="330" width="90" height="150" />
          <rect x="560" y="350" width="11" height="14" fill="#5d7a8f" />
          <rect x="580" y="350" width="11" height="14" fill="#5d7a8f" />
          <rect x="600" y="350" width="11" height="14" fill="#5d7a8f" />
          <rect x="560" y="380" width="11" height="14" fill="#5d7a8f" />
          <rect x="580" y="380" width="11" height="14" fill="#5d7a8f" />
          <rect x="600" y="380" width="11" height="14" fill="#5d7a8f" />
          
          <rect x="690" y="280" width="105" height="200" />
          <rect x="702" y="305" width="12" height="16" fill="#5d7a8f" />
          <rect x="726" y="305" width="12" height="16" fill="#5d7a8f" />
          <rect x="750" y="305" width="12" height="16" fill="#5d7a8f" />
          <rect x="702" y="340" width="12" height="16" fill="#5d7a8f" />
          <rect x="726" y="340" width="12" height="16" fill="#5d7a8f" />
          <rect x="750" y="340" width="12" height="16" fill="#5d7a8f" />
          <rect x="702" y="375" width="12" height="16" fill="#5d7a8f" />
          <rect x="726" y="375" width="12" height="16" fill="#5d7a8f" />
          <rect x="750" y="375" width="12" height="16" fill="#5d7a8f" />

          <rect x="840" y="240" width="115" height="240" />
          <polygon points="897.5,240 888,225 907,225" fill="#1b3a52" />
          <rect x="852" y="270" width="13" height="16" fill="#5d7a8f" />
          <rect x="878" y="270" width="13" height="16" fill="#5d7a8f" />
          <rect x="904" y="270" width="13" height="16" fill="#5d7a8f" />
          <rect x="852" y="310" width="13" height="16" fill="#5d7a8f" />
          <rect x="878" y="310" width="13" height="16" fill="#5d7a8f" />
          <rect x="904" y="310" width="13" height="16" fill="#5d7a8f" />
          <rect x="852" y="350" width="13" height="16" fill="#5d7a8f" />
          <rect x="878" y="350" width="13" height="16" fill="#5d7a8f" />
          <rect x="904" y="350" width="13" height="16" fill="#5d7a8f" />
          
          <rect x="1000" y="350" width="75" height="130" />
          <rect x="1010" y="370" width="10" height="12" fill="#5d7a8f" />
          <rect x="1028" y="370" width="10" height="12" fill="#5d7a8f" />
          <rect x="1046" y="370" width="10" height="12" fill="#5d7a8f" />
          <rect x="1010" y="395" width="10" height="12" fill="#5d7a8f" />
          <rect x="1028" y="395" width="10" height="12" fill="#5d7a8f" />
          <rect x="1046" y="395" width="10" height="12" fill="#5d7a8f" />
          
          <rect x="1110" y="320" width="95" height="160" />
          <rect x="1120" y="340" width="11" height="14" fill="#5d7a8f" />
          <rect x="1140" y="340" width="11" height="14" fill="#5d7a8f" />
          <rect x="1160" y="340" width="11" height="14" fill="#5d7a8f" />
          <rect x="1120" y="365" width="11" height="14" fill="#5d7a8f" />
          <rect x="1140" y="365" width="11" height="14" fill="#5d7a8f" />
          <rect x="1160" y="365" width="11" height="14" fill="#5d7a8f" />
          <rect x="1120" y="390" width="11" height="14" fill="#5d7a8f" />
          <rect x="1140" y="390" width="11" height="14" fill="#5d7a8f" />
          <rect x="1160" y="390" width="11" height="14" fill="#5d7a8f" />
        </g>
      </svg>
      
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo"><BusIcon size={36} /></div>
          <h1>SafarPass</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com"
              className="form-input" required autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPass ? 'text' : 'password'} name="password" value={form.password}
                onChange={handleChange} placeholder="Your password"
                className="form-input" required autoComplete="current-password"
              />
              <button type="button" className="show-pass" onClick={() => setShowPass(s => !s)} aria-label="Toggle password visibility">
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
