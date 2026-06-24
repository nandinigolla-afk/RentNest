import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminComponents.css';

const STATUS_OPTIONS = ['pending','confirmed','delivered','active','return_requested','returned','cancelled'];
const STATUS_COLORS = { pending:'warning', confirmed:'primary', delivered:'success', active:'success', return_requested:'warning', returned:'primary', cancelled:'danger' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 15, ...(filterStatus && { status: filterStatus }) });
      const { data } = await api.get(`/orders?${q}`);
      setOrders(data.data);
      setTotal(data.pagination.total);
    } catch (e) { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, filterStatus]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status, note: `Status updated to ${status} by admin` });
      toast.success('Status updated!');
      fetchOrders();
    } catch (e) { toast.error('Failed to update'); }
  };

  return (
    <div className="admin-comp">
      <div className="comp-header">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['', ...STATUS_OPTIONS].map(s => (
            <button key={s} className={`filter-pill ${filterStatus === s ? 'active' : ''}`} onClick={() => { setFilterStatus(s); setPage(1); }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>
      <p className="comp-count">{total} orders total</p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Delivery Date</th><th>Status</th><th>Update Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }}/></td></tr>
            ) : orders.map(o => (
              <React.Fragment key={o._id}>
                <tr onClick={() => setExpanded(expanded === o._id ? null : o._id)} style={{ cursor: 'pointer' }}>
                  <td><span className="order-id-cell">#{o._id.slice(-6).toUpperCase()}</span></td>
                  <td>{o.user?.name}<br/><small>{o.user?.email}</small></td>
                  <td>{o.items?.length} item(s)</td>
                  <td><strong>₹{o.totalAmount?.toLocaleString()}</strong></td>
                  <td>{new Date(o.deliveryDate).toLocaleDateString('en-IN')}</td>
                  <td><span className={`badge badge-${STATUS_COLORS[o.status]||'primary'}`}>{o.status?.replace('_',' ')}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      className="form-input"
                      style={{ padding: '6px 8px', fontSize: '0.8rem', width: 'auto' }}
                      value={o.status}
                      onChange={e => updateStatus(o._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                    </select>
                  </td>
                </tr>
                {expanded === o._id && (
                  <tr>
                    <td colSpan="7" style={{ padding: 0 }}>
                      <div className="order-expand-panel">
                        <div className="oep-grid">
                          <div>
                            <strong>Items:</strong>
                            {o.items?.map((item, i) => (
                              <div key={i} className="oep-item">
                                <img src={item.product?.images?.[0]} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}/>
                                <div>
                                  <span>{item.product?.name}</span>
                                  <small>₹{item.monthlyRent}/mo × {item.tenureMonths}mo = ₹{item.totalRent?.toLocaleString()}</small>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <strong>Delivery Address:</strong>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 6, lineHeight: 1.6 }}>
                              {o.deliveryAddress?.street},<br/>
                              {o.deliveryAddress?.city}, {o.deliveryAddress?.state} - {o.deliveryAddress?.pincode}
                            </p>
                          </div>
                          <div>
                            <strong>Summary:</strong>
                            <div className="mini-row" style={{ marginTop: 6 }}><span>Rent</span><span>₹{o.subtotal?.toLocaleString()}</span></div>
                            <div className="mini-row"><span>Deposit</span><span>₹{o.securityDepositTotal?.toLocaleString()}</span></div>
                            <div className="mini-row" style={{ fontWeight: 700 }}><span>Total</span><span>₹{o.totalAmount?.toLocaleString()}</span></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comp-pagination">
        <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
        <span>Page {page}</span>
        <button className="btn btn-outline btn-sm" disabled={orders.length < 15} onClick={() => setPage(p => p + 1)}>Next →</button>
      </div>
    </div>
  );
};

export default AdminOrders;
