import React, { useState, useEffect } from 'react';
import { getAdminRoutes, createRoute, updateRoute, deleteRoute } from '../../api/admin.api';
import { toast } from 'react-toastify';

const BLANK = { routeNumber: '', routeName: '', startPoint: '', endPoint: '', distance: '', fare: '', stops: '' };

const RoutesPage = () => {
  const [routes, setRoutes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); 
  const [form, setForm]       = useState(BLANK);
  const [saving, setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    getAdminRoutes().then(setRoutes).catch(() => toast.error('Failed to load routes.')).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd  = () => { setForm(BLANK); setModal('add'); };
  const openEdit = (r) => {
    setForm({ ...r, stops: r.stops?.map(s => s.name).join(', ') || '', distance: r.distance || '', fare: r.fare || '' });
    setModal(r);
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const stopsList = form.stops.split(',').map((s, i) => ({ name: s.trim(), order: i + 1 })).filter(s => s.name);
      const payload = { ...form, stops: stopsList, distance: Number(form.distance), fare: Number(form.fare) };

      if (modal === 'add') await createRoute(payload);
      else await updateRoute(modal._id, payload);

      toast.success(modal === 'add' ? 'Route created!' : 'Route updated!');
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this route?')) return;
    try {
      await deleteRoute(id);
      toast.success('Route deactivated.');
      load();
    } catch {
      toast.error('Failed to deactivate route.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manage Routes</h1>
        <button className="btn-primary" onClick={openAdd}>Add Route</button>
      </div>

      {loading ? <div className="loading-text">Loading routes...</div> : (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>Route No.</th><th>Name</th><th>From → To</th><th>Distance</th><th>Fare</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {routes.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No routes found.</td></tr>
                ) : routes.map(r => (
                  <tr key={r._id}>
                    <td><strong>{r.routeNumber}</strong></td>
                    <td>{r.routeName}</td>
                    <td>{r.startPoint} → {r.endPoint}</td>
                    <td>{r.distance} km</td>
                    <td>₹{r.fare}</td>
                    <td><span style={{ background: r.isActive ? '#d1fae5' : '#fee2e2', color: r.isActive ? '#065f46' : '#991b1b', padding: '3px 8px', borderRadius: 12, fontSize: 12 }}>{r.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-sm btn-outline" onClick={() => openEdit(r)}>Edit</button>
                        {r.isActive && <button className="btn-sm btn-danger" onClick={() => handleDelete(r._id)}>Deactivate</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <h2>{modal === 'add' ? 'Add New Route' : 'Edit Route'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group"><label>Route Number *</label><input name="routeNumber" value={form.routeNumber} onChange={handleChange} className="form-input" required placeholder="e.g. R006" /></div>
                <div className="form-group"><label>Route Name *</label><input name="routeName" value={form.routeName} onChange={handleChange} className="form-input" required placeholder="City Center - Airport" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Start Point *</label><input name="startPoint" value={form.startPoint} onChange={handleChange} className="form-input" required /></div>
                <div className="form-group"><label>End Point *</label><input name="endPoint" value={form.endPoint} onChange={handleChange} className="form-input" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Distance (km)</label><input type="number" name="distance" value={form.distance} onChange={handleChange} className="form-input" min={0} /></div>
                <div className="form-group"><label>Fare (₹)</label><input type="number" name="fare" value={form.fare} onChange={handleChange} className="form-input" min={0} /></div>
              </div>
              <div className="form-group">
                <label>Stops (comma-separated)</label>
                <textarea name="stops" value={form.stops} onChange={handleChange} className="form-input" rows={3} placeholder="Stop 1, Stop 2, Stop 3" />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Route'}</button>
                <button type="button" className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
