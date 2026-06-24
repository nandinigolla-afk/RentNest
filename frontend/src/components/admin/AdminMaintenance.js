import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminComponents.css';

const PRIORITY_COLORS = { Low: 'primary', Medium: 'warning', High: 'danger', Urgent: 'danger' };
const STATUS_COLORS = { open: 'danger', in_progress: 'warning', resolved: 'success', closed: 'primary' };

const AdminMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [noteInputs, setNoteInputs] = useState({});

  const fetch = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (filterStatus) q.set('status', filterStatus);
      if (filterPriority) q.set('priority', filterPriority);
      const { data } = await api.get(`/maintenance?${q}`);
      setRequests(data.data);
    } catch (e) { toast.error('Failed to load maintenance requests'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filterStatus, filterPriority]);

  const updateRequest = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/maintenance/${id}`, { status, adminNotes: noteInputs[id] || '' });
      toast.success('Request updated!');
      fetch();
    } catch (e) { toast.error('Failed to update'); }
    finally { setUpdatingId(null); }
  };

  const statuses = ['', 'open', 'in_progress', 'resolved', 'closed'];
  const priorities = ['', 'Low', 'Medium', 'High', 'Urgent'];

  return (
    <div className="admin-comp">
      <div className="comp-header">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="form-input" style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {statuses.map(s => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All Statuses'}</option>)}
          </select>
          <select className="form-input" style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            {priorities.map(p => <option key={p} value={p}>{p || 'All Priorities'}</option>)}
          </select>
        </div>
      </div>
      <p className="comp-count">{requests.length} maintenance requests</p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner"/></div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }}>🔧</span>
          <p>No maintenance requests</p>
        </div>
      ) : (
        <div className="maintenance-cards">
          {requests.map(r => (
            <div key={r._id} className="maintenance-card animate-fade-up">
              <div className="mc-header">
                <div>
                  <span className={`badge badge-${PRIORITY_COLORS[r.priority]}`}>{r.priority}</span>
                  <span className={`badge badge-${STATUS_COLORS[r.status]}`} style={{ marginLeft: 6 }}>{r.status.replace('_', ' ')}</span>
                </div>
                <small style={{ color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</small>
              </div>
              <div className="mc-body">
                <div className="mc-product">
                  {r.product?.images?.[0] && (
                    <img src={r.product.images[0]} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }}/>
                  )}
                  <div>
                    <strong>{r.product?.name || 'Unknown Product'}</strong>
                    <span>{r.issueType}</span>
                  </div>
                </div>
                <div className="mc-user">
                  <span>👤 {r.user?.name}</span>
                  <span>📧 {r.user?.email}</span>
                  {r.user?.phone && <span>📞 {r.user?.phone}</span>}
                </div>
                <div className="mc-description">
                  <strong>Issue:</strong>
                  <p>{r.description}</p>
                </div>
                {r.adminNotes && (
                  <div className="mc-notes">
                    <strong>Admin Notes:</strong>
                    <p>{r.adminNotes}</p>
                  </div>
                )}
                <div className="mc-actions">
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="Add admin notes..."
                    value={noteInputs[r._id] || r.adminNotes || ''}
                    onChange={e => setNoteInputs(n => ({ ...n, [r._id]: e.target.value }))}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {['in_progress', 'resolved', 'closed'].map(s => (
                      <button
                        key={s}
                        className={`btn btn-sm ${s === 'resolved' ? 'btn-primary' : 'btn-outline'}`}
                        disabled={r.status === s || updatingId === r._id}
                        onClick={() => updateRequest(r._id, s)}
                      >
                        {updatingId === r._id ? '...' : `Mark ${s.replace('_', ' ')}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMaintenance;
