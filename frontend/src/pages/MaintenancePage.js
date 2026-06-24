import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './MaintenancePage.css';

const ISSUE_TYPES = ['Repair', 'Replacement', 'Cleaning', 'Installation', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const MaintenancePage = () => {
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ orderId: '', productId: '', issueType: 'Repair', description: '', priority: 'Medium' });
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/maintenance/my-requests'),
      api.get('/orders/my-orders'),
    ]).then(([maint, orders]) => {
      setRequests(maint.data.data);
      const activeOrders = orders.data.data.filter(o => ['active','delivered'].includes(o.status));
      setOrders(activeOrders);
    }).catch(() => toast.error('Failed to load data'))
    .finally(() => setLoading(false));
  }, []);

  const handleOrderChange = (orderId) => {
    setForm(f => ({ ...f, orderId, productId: '' }));
    const order = orders.find(o => o._id === orderId);
    setSelectedOrderItems(order?.items || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.orderId || !form.productId || !form.description) { toast.error('Please fill all required fields'); return; }
    setSubmitting(true);
    try {
      const { data } = await api.post('/maintenance', form);
      setRequests(r => [data.data, ...r]);
      toast.success('Maintenance request submitted!');
      setShowForm(false);
      setForm({ orderId: '', productId: '', issueType: 'Repair', description: '', priority: 'Medium' });
    } catch (e) { toast.error(e.response?.data?.message || 'Submission failed'); }
    finally { setSubmitting(false); }
  };

  const STATUS_COLORS = { open: 'danger', in_progress: 'warning', resolved: 'success', closed: 'primary' };
  const PRIORITY_COLORS = { Low: 'primary', Medium: 'warning', High: 'danger', Urgent: 'danger' };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 70 }}>
      <div className="spinner"/>
    </div>
  );

  return (
    <div className="maintenance-page">
      <div className="container">
        <div className="page-header">
          <h1>Maintenance Requests</h1>
          <p>Report issues with your rented products and we'll fix them fast</p>
        </div>

        <div className="maint-top-row">
          <div className="maint-stats">
            {[
              { label: 'Open', count: requests.filter(r => r.status === 'open').length, color: '#EF4444' },
              { label: 'In Progress', count: requests.filter(r => r.status === 'in_progress').length, color: '#F59E0B' },
              { label: 'Resolved', count: requests.filter(r => r.status === 'resolved').length, color: '#10B981' },
            ].map(s => (
              <div key={s.label} className="maint-stat" style={{ borderLeftColor: s.color }}>
                <strong style={{ color: s.color }}>{s.count}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Request</button>
        </div>

        {requests.length === 0 ? (
          <div className="empty-maint animate-fade-up">
            <span>🔧</span>
            <h3>No maintenance requests yet</h3>
            <p>If you face any issues with your rented products, raise a request.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>Raise a Request</button>
          </div>
        ) : (
          <div className="maint-requests">
            {requests.map((r, i) => (
              <div key={r._id} className={`maint-card animate-fade-up delay-${Math.min((i+1)*100,500)}`}>
                <div className="maint-card-left">
                  {r.product?.images?.[0] && (
                    <img src={r.product.images[0]} alt="" className="maint-img"/>
                  )}
                  <div className="maint-info">
                    <strong>{r.product?.name || 'Unknown Product'}</strong>
                    <span>{r.issueType}</span>
                    <p>{r.description}</p>
                    {r.adminNotes && (
                      <div className="admin-note">
                        <strong>Admin Note:</strong> {r.adminNotes}
                      </div>
                    )}
                    {r.scheduledDate && (
                      <div className="scheduled-date">📅 Scheduled: {new Date(r.scheduledDate).toLocaleDateString('en-IN')}</div>
                    )}
                  </div>
                </div>
                <div className="maint-card-right">
                  <span className={`badge badge-${PRIORITY_COLORS[r.priority]}`}>{r.priority}</span>
                  <span className={`badge badge-${STATUS_COLORS[r.status]}`}>{r.status.replace('_', ' ')}</span>
                  <small>{new Date(r.createdAt).toLocaleDateString('en-IN')}</small>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Request Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <div className="modal-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3>New Maintenance Request</h3>
                <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
              </div>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                  <p>You have no active rentals to raise a request for.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Select Order *</label>
                    <select className="form-input" value={form.orderId} onChange={e => handleOrderChange(e.target.value)} required>
                      <option value="">-- Select an order --</option>
                      {orders.map(o => (
                        <option key={o._id} value={o._id}>
                          #{o._id.slice(-6).toUpperCase()} · {o.items.length} item(s) · {o.status}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedOrderItems.length > 0 && (
                    <div className="form-group">
                      <label className="form-label">Select Product *</label>
                      <select className="form-input" value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))} required>
                        <option value="">-- Select a product --</option>
                        {selectedOrderItems.map(item => (
                          <option key={item.product?._id} value={item.product?._id}>{item.product?.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Issue Type *</label>
                    <select className="form-input" value={form.issueType} onChange={e => setForm(f => ({ ...f, issueType: e.target.value }))}>
                      {ISSUE_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {PRIORITIES.map(p => (
                        <button type="button" key={p}
                          className={`filter-chip ${form.priority === p ? 'active' : ''}`}
                          onClick={() => setForm(f => ({ ...f, priority: p }))}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issue Description *</label>
                    <textarea className="form-input" rows={4} placeholder="Describe the issue in detail..."
                      value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required/>
                  </div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? <span className="btn-spinner"/> : 'Submit Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
