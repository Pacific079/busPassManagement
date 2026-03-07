import React, { useState, useEffect } from 'react';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '../../api/admin.api';
import { toast } from 'react-toastify';

const BLANK = { name: '', description: '', price: '', duration: 30, discount: 0, requiredDocuments: ['idProof', 'addressProof'] };
const ALL_DOCS = ['idProof', 'addressProof', 'ageProof', 'studentId', 'disabilityProof'];
const DOC_LABELS = { idProof: 'ID Proof', addressProof: 'Address Proof', ageProof: 'Age Proof', studentId: 'Student ID', disabilityProof: 'Disability Proof' };

const CategoriesPage = () => {
  const [cats, setCats]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(BLANK);
  const [saving, setSaving]   = useState(false);

  const load = () => {
    setLoading(true);
    getAdminCategories().then(setCats).catch(() => toast.error('Failed to load.')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = () => { setForm(BLANK); setModal('add'); };
  const openEdit = (c) => { setForm({ ...c, price: c.price, discount: c.discount }); setModal(c); };

  const toggleDoc = (doc) => {
    setForm(f => ({
      ...f,
      requiredDocuments: f.requiredDocuments.includes(doc)
        ? f.requiredDocuments.filter(d => d !== doc)
        : [...f.requiredDocuments, doc],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), duration: Number(form.duration), discount: Number(form.discount) };
      if (modal === 'add') await createCategory(payload);
      else await updateCategory(modal._id, payload);
      toast.success(modal === 'add' ? 'Category created!' : 'Category updated!');
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this category?')) return;
    try { await deleteCategory(id); toast.success('Category deactivated.'); load(); }
    catch { toast.error('Failed.'); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Pass Categories</h1>
        <button className="btn-primary" onClick={openAdd}>Add Category</button>
      </div>

      {loading ? <div className="loading-text">Loading...</div> : (
        <div className="category-admin-grid">
          {cats.map(cat => (
            <div key={cat._id} className="category-admin-card">
              <div className="cat-header">
                <h3>{cat.name}</h3>
                <span style={{ background: cat.isActive ? '#d1fae5' : '#fee2e2', color: cat.isActive ? '#065f46' : '#991b1b', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: 14 }}>{cat.description}</p>
              <div className="cat-details">
                <div><span>Price</span><strong>₹{cat.price}/month</strong></div>
                <div><span>Duration</span><strong>{cat.duration} days</strong></div>
                <div><span>Discount</span><strong>{cat.discount}%</strong></div>
              </div>
              <div style={{ marginTop: 8 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>Required: </span>
                {cat.requiredDocuments?.map(d => (
                  <span key={d} style={{ background: 'var(--primary-lt)', color: 'var(--primary)', padding: '2px 6px', borderRadius: 4, fontSize: 11, marginRight: 4 }}>{DOC_LABELS[d] || d}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn-sm btn-outline" onClick={() => openEdit(cat)}>Edit</button>
                {cat.isActive && <button className="btn-sm btn-danger" onClick={() => handleDelete(cat._id)}>Deactivate</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <h2>{modal === 'add' ? 'Add Category' : 'Edit Category'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Category Name *</label><input name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="form-input" required placeholder="e.g. Student" /></div>
              <div className="form-group"><label>Description</label><textarea name="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="form-input" rows={2} /></div>
              <div className="form-row">
                <div className="form-group"><label>Price (₹) *</label><input type="number" name="price" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="form-input" required min={0} /></div>
                <div className="form-group"><label>Duration (days)</label><input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="form-input" min={1} /></div>
                <div className="form-group"><label>Discount (%)</label><input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} className="form-input" min={0} max={100} /></div>
              </div>
              <div className="form-group">
                <label>Required Documents</label>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                  {ALL_DOCS.map(doc => (
                    <label key={doc} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
                      <input type="checkbox" checked={form.requiredDocuments?.includes(doc)} onChange={() => toggleDoc(doc)} />
                      {DOC_LABELS[doc]}
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" className="btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
