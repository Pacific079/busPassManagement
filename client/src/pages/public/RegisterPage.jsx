import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { BusIcon } from '../../components/common/Icons';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', gender: '', dateOfBirth: '',
    address: { street: '', city: '', state: '', pincode: '' },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm(f => ({ ...f, address: { ...f.address, [key]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (!/^[0-9]{10}$/.test(form.phone)) return toast.error('Enter a valid 10-digit phone number.');

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      await register(submitData);
      toast.success('Registration successful! Welcome aboard!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-logo"><BusIcon size={36} /></div>
          <h1>Create Account</h1>
          <p>Join SafarPass to manage your bus passes online</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="form-input" required />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" className="form-input" required maxLength={10} />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="form-input" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" className="form-input" required />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" className="form-input" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="form-input">
                <option value="">Select gender</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>

          <div className="form-section-title">Address (Optional)</div>
          <div className="form-row">
            <div className="form-group">
              <label>Street</label>
              <input type="text" name="address.street" value={form.address.street} onChange={handleChange} placeholder="Street / Area" className="form-input" />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="address.city" value={form.address.city} onChange={handleChange} placeholder="City" className="form-input" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <input type="text" name="address.state" value={form.address.state} onChange={handleChange} placeholder="State" className="form-input" />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input type="text" name="address.pincode" value={form.address.pincode} onChange={handleChange} placeholder="6-digit pincode" className="form-input" maxLength={6} />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
