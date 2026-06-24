import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './MyOrdersPage.css';

const STATUS_COLORS = {
  pending: 'warning', confirmed: 'primary', delivered: 'success',
  active: 'success', return_requested: 'warning', returned: 'primary', cancelled: 'danger',
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(({ data }) => setOrders(data.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const requestReturn = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/request-return`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'return_requested' } : o));
      toast.success('Return request submitted!');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const filtered = activeFilter === 'all' ? orders : orders.filter(o => o.status === activeFilter);
  const filters = ['all', 'pending', 'active', 'delivered', 'returned'];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 70 }}>
      <div className="spinner"/>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Rentals</h1>
          <p>Track and manage all your rental orders</p>
        </div>

        <div className="order-filters">
          {filters.map(f => (
            <button key={f} className={`filter-pill ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'all' && <span className="pill-count">{orders.length}</span>}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-orders animate-fade-up">
            <span>📦</span>
            <h3>No orders found</h3>
            <p>Start renting to see your orders here</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="orders-list">
            {filtered.map((order, i) => (
              <div key={order._id} className={`order-card animate-fade-up delay-${Math.min((i+1)*100, 500)}`}>
                <div className="order-card-header" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                  <div className="order-id-section">
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`badge badge-${STATUS_COLORS[order.status] || 'primary'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="order-meta">
                    <span className="order-date">🗓 {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                    <span className="order-total">₹{order.totalAmount?.toLocaleString()}</span>
                    <span className="expand-icon">{expandedOrder === order._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="order-card-body animate-fade-in">
                    {/* Items */}
                    <div className="order-items">
                      {order.items.map((item, j) => (
                        <div key={j} className="order-item">
                          <img
                            src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100'}
                            alt={item.product?.name}
                            className="order-item-img"
                          />
                          <div className="order-item-info">
                            <Link to={`/products/${item.product?._id}`}><strong>{item.product?.name}</strong></Link>
                            <span>{item.product?.category}</span>
                            <span>₹{item.monthlyRent}/mo × {item.tenureMonths} months</span>
                          </div>
                          <div className="order-item-total">
                            ₹{item.totalRent?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="order-summary-grid">
                      <div className="order-summary-box">
                        <h4>📍 Delivery Address</h4>
                        <p>{order.deliveryAddress?.street},<br/>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
                      </div>
                      <div className="order-summary-box">
                        <h4>📊 Payment Summary</h4>
                        <div className="mini-row"><span>Rent Total</span><span>₹{order.subtotal?.toLocaleString()}</span></div>
                        <div className="mini-row"><span>Security Deposit</span><span>₹{order.securityDepositTotal?.toLocaleString()}</span></div>
                        <div className="mini-row total"><span>Grand Total</span><span>₹{order.totalAmount?.toLocaleString()}</span></div>
                      </div>
                      <div className="order-summary-box">
                        <h4>🗓 Timeline</h4>
                        <div className="mini-row"><span>Ordered</span><span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span></div>
                        <div className="mini-row"><span>Delivery</span><span>{new Date(order.deliveryDate).toLocaleDateString('en-IN')}</span></div>
                        {order.pickupDate && <div className="mini-row"><span>Pickup</span><span>{new Date(order.pickupDate).toLocaleDateString('en-IN')}</span></div>}
                      </div>
                    </div>

                    {/* Status History */}
                    <div className="status-history">
                      <h4>Order Timeline</h4>
                      <div className="timeline">
                        {order.statusHistory?.map((h, idx) => (
                          <div key={idx} className={`timeline-item ${idx === order.statusHistory.length - 1 ? 'current' : ''}`}>
                            <div className="timeline-dot"/>
                            <div className="timeline-content">
                              <strong>{h.status.replace('_', ' ')}</strong>
                              {h.note && <span>{h.note}</span>}
                              <small>{new Date(h.updatedAt).toLocaleDateString('en-IN')}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="order-actions">
                      {(order.status === 'active' || order.status === 'delivered') && (
                        <button className="btn btn-outline btn-sm" onClick={() => requestReturn(order._id)}>
                          Request Return
                        </button>
                      )}
                      {order.status === 'active' && (
                        <Link to="/maintenance" className="btn btn-outline btn-sm">🔧 Request Maintenance</Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
