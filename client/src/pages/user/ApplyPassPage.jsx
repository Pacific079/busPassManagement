import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getRoutes, applyPass } from '../../api/pass.api';
import { toast } from 'react-toastify';

const STEPS = ['Select Category', 'Select Route', 'Upload Documents', 'Payment & Submit'];

const ApplyPassPage = () => {
  const navigate = useNavigate();
  const [step, setStep]               = useState(0);
  const [categories, setCategories]   = useState([]);
  const [routes, setRoutes]           = useState([]);
  const [loading, setLoading]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  const [form, setForm] = useState({
    categoryId: '', routeId: '', paymentMethod: 'Mock',
    purpose: '', applicantDetails: { name: '', phone: '', address: '' },
    documents: {},
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getCategories(), getRoutes()])
      .then(([cats, rts]) => { setCategories(cats); setRoutes(rts); })
      .catch(() => toast.error('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  const selectCategory = (cat) => {
    setSelectedCategory(cat);
    setForm(f => ({ ...f, categoryId: cat._id }));
    setStep(1);
  };

  const selectRoute = (route) => {
    setForm(f => ({ ...f, routeId: route._id }));
    setStep(2);
  };

  const handleFileChange = (e, docType) => {
    setForm(f => ({ ...f, documents: { ...f.documents, [docType]: e.target.files[0] } }));
  };

  const handleSubmit = async () => {
    if (!form.categoryId || !form.routeId) return toast.error('Please complete all steps.');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('categoryId', form.categoryId);
      fd.append('routeId',    form.routeId);
      fd.append('paymentMethod', form.paymentMethod);
      fd.append('applicantDetails', JSON.stringify(form.applicantDetails));
      Object.entries(form.documents).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });

      const result = await applyPass(fd);
      toast.success('Pass application submitted successfully!');
      navigate('/my-passes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const requiredDocs = selectedCategory?.requiredDocuments || [];

  return (
    <div className="page-container">
      <h1 className="page-title">Apply for Bus Pass</h1>
      <div className="stepper">
        {STEPS.map((label, i) => (
          <div key={i} className={`step ${i <= step ? 'step-active' : ''} ${i < step ? 'step-done' : ''}`}>
            <div className="step-num">{i < step ? '✓' : i + 1}</div>
            <span className="step-label">{label}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="card">
        {step === 0 && (
          <div>
            <h2 className="step-title">Choose a Pass Category</h2>
            {loading ? <div className="loading-text">Loading categories...</div> : (
              <div className="category-grid">
                {categories.map(cat => (
                  <div key={cat._id} className="category-card" onClick={() => selectCategory(cat)}>
                    <div className="category-icon">📄</div>
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                    <div className="category-price">
                      {cat.discount > 0 && <span className="discount-badge">{cat.discount}% off</span>}
                      <strong>₹{cat.price}</strong>/month
                    </div>
                    <div className="category-docs">
                      Requires: {cat.requiredDocuments?.join(', ')}
                    </div>
                    <button className="btn-primary" style={{ width: '100%', marginTop: 12 }}>
                      Select →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="step-back">
              <button onClick={() => setStep(0)} className="btn-ghost">← Back</button>
              <h2 className="step-title">Choose Your Route</h2>
            </div>
            {loading ? <div className="loading-text">Loading routes...</div> : (
              <div className="route-list">
                {routes.map(route => (
                  <div key={route._id} className="route-card" onClick={() => selectRoute(route)}>
                    <div className="route-header">
                      <span className="route-number">{route.routeNumber}</span>
                      <span className="route-distance">{route.distance} km</span>
                    </div>
                    <div className="route-name">{route.routeName}</div>
                    <div className="route-endpoints">
                      <span>{route.startPoint}</span>
                      <span className="arrow-sep">→</span>
                      <span>{route.endPoint}</span>
                    </div>
                    <div className="route-stops">
                      Stops: {route.stops?.map(s => s.name).join(' · ')}
                    </div>
                    <button className="btn-primary" style={{ marginTop: 12 }}>Select Route →</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="step-back">
              <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
              <h2 className="step-title">Upload Required Documents</h2>
            </div>
            <div className="info-box">
              Upload clear, readable copies (JPG, PNG, or PDF, max 5MB each)
            </div>
            <div className="docs-grid">
              {requiredDocs.map(doc => (
                <div key={doc} className="doc-upload-card">
                  <label className="doc-label">
                    {DOC_LABELS[doc] || doc} <span className="required-star">*</span>
                  </label>
                  <input
                    type="file" accept=".jpg,.jpeg,.png,.pdf"
                    onChange={e => handleFileChange(e, doc)}
                    className="file-input"
                  />
                  {form.documents[doc] && (
                    <p className="file-selected">{form.documents[doc].name}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="form-group" style={{ marginTop: 20 }}>
              <label>Additional Notes (Optional)</label>
              <textarea
                className="form-input" rows={3} placeholder="Any special requirements..."
                value={form.applicantDetails.address}
                onChange={e => setForm(f => ({ ...f, applicantDetails: { ...f.applicantDetails, address: e.target.value } }))}
              />
            </div>

            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setStep(3)}>
              Continue to Payment →
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="step-back">
              <button onClick={() => setStep(2)} className="btn-ghost">← Back</button>
              <h2 className="step-title">Review & Pay</h2>
            </div>

            <div className="summary-card">
              <h3>Application Summary</h3>
              <div className="summary-row"><span>Category</span><strong>{selectedCategory?.name}</strong></div>
              <div className="summary-row"><span>Route</span><strong>{routes.find(r => r._id === form.routeId)?.routeName}</strong></div>
              <div className="summary-row"><span>Duration</span><strong>{selectedCategory?.duration} days</strong></div>
              <div className="summary-row total-row"><span>Amount to Pay</span><strong>₹{selectedCategory?.price}</strong></div>
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods">
                {['Mock', 'UPI', 'Card', 'NetBanking'].map(m => (
                  <label key={m} className={`pay-method ${form.paymentMethod === m ? 'pay-method-active' : ''}`}>
                    <input type="radio" name="paymentMethod" value={m} checked={form.paymentMethod === m}
                      onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} />
                    {m === 'Mock' ? 'Mock Pay' : m === 'UPI' ? 'UPI' : m === 'Card' ? 'Card' : 'Net Banking'}
                  </label>
                ))}
              </div>
            </div>

            {form.paymentMethod === 'Mock' && (
              <div className="info-box" style={{ marginTop: 12 }}>
                Using Mock payment — no real transaction will occur.
              </div>
            )}

            <button
              className="btn-primary btn-full" style={{ marginTop: 24, fontSize: 16 }}
              onClick={handleSubmit} disabled={submitting}
            >
              {submitting ? 'Processing...' : `Pay ₹${selectedCategory?.price} & Submit Application`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DOC_LABELS = {
  idProof:        'ID Proof (Aadhaar / Voter ID)',
  addressProof:   'Address Proof',
  ageProof:       'Age Proof (Birth Certificate)',
  studentId:      'Student ID Card',
  disabilityProof:'Disability Certificate',
};

export default ApplyPassPage;
