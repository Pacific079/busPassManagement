import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../api/auth.api';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [tab, setTab]           = useState('profile');
  const [saving, setSaving]     = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    gender: user?.gender || '', dateOfBirth: user?.dateOfBirth?.split('T')[0] || '',
    address: {
      street:  user?.address?.street  || '',
      city:    user?.address?.city    || '',
      state:   user?.address?.state   || '',
      pincode: user?.address?.pincode || '',
    },
  });

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const k = name.split('.')[1];
      setForm(f => ({ ...f, address: { ...f.address, [k]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'address') fd.append('address', JSON.stringify(v));
        else fd.append(k, v);
      });
      await updateProfile(fd);
      await refreshUser();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) return toast.error('Passwords do not match.');
    if (passForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters.');
    setSaving(true);
    try {
      await changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">My Profile</h1>

      {/* Avatar section */}
      <div className="profile-avatar-section">
        <div className="avatar-circle">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <span className={`role-badge role-badge-${user?.role}`}>{user?.role}</span>
        </div>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'profile' ? 'tab-btn-active' : ''}`} onClick={() => setTab('profile')}>Profile Info</button>
        <button className={`tab-btn ${tab === 'password' ? 'tab-btn-active' : ''}`} onClick={() => setTab('password')}>Change Password</button>
      </div>

      {tab === 'profile' && (
        <div className="card">
          <form onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="form-input" maxLength={10} />
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
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>

            <div className="form-section-title">Address</div>
            <div className="form-row">
              <div className="form-group">
                <label>Street</label>
                <input name="address.street" value={form.address.street} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input name="address.city" value={form.address.city} onChange={handleChange} className="form-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input name="address.state" value={form.address.state} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input name="address.pincode" value={form.address.pincode} onChange={handleChange} className="form-input" maxLength={6} />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className="card">
          <form onSubmit={handlePasswordChange}>
            {[
              { label: 'Current Password', name: 'currentPassword', placeholder: 'Enter current password' },
              { label: 'New Password',     name: 'newPassword',     placeholder: 'Min 6 characters' },
              { label: 'Confirm Password', name: 'confirmPassword', placeholder: 'Repeat new password' },
            ].map(f => (
              <div className="form-group" key={f.name}>
                <label>{f.label}</label>
                <input type="password" name={f.name} value={passForm[f.name]} placeholder={f.placeholder}
                  onChange={e => setPassForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                  className="form-input" required />
              </div>
            ))}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
