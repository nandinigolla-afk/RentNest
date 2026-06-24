import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';
import AdminMaintenance from '../components/admin/AdminMaintenance';
import './AdminDashboard.css';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="stat-box animate-fade-up" style={{ '--c': color }}>
    <div className="stat-box-icon">{icon}</div>
    <div className="stat-box-info">
      <div className="stat-box-value">{value}</div>
      <div className="stat-box-label">{label}</div>
      {sub && <div className="stat-box-sub">{sub}</div>}
    </div>
  </div>
);

const TABS = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'products', label: '🛋️ Products' },
  { id: 'orders', label: '📦 Orders' },
  { id: 'users', label: '👥 Users' },
  { id: 'maintenance', label: '🔧 Maintenance' },
];

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    api.get('/admin/dashboard')
      .then(({ data }) => setDashboard(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) return null;

  const stats = dashboard?.stats;

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>🏠</span>
          <div>
            <strong>RentNest</strong>
            <span>Admin Panel</span>
          </div>
        </div>
        <nav className="admin-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`admin-nav-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-user-info">
          <div className="admin-avatar">{user?.name?.charAt(0)}</div>
          <div>
            <strong>{user?.name}</strong>
            <span>Administrator</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>{TABS.find(t => t.id === activeTab)?.label}</h1>
            <span>Welcome back, {user?.name}</span>
          </div>
          <div className="admin-topbar-actions">
            <Link to="/" className="btn btn-outline btn-sm">← View Site</Link>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              {/* Stats */}
              <div className="admin-stats-grid">
                <StatCard icon="👥" label="Total Users" value={stats?.totalUsers ?? '—'} color="#6C3CE1"/>
                <StatCard icon="🛋️" label="Active Products" value={stats?.totalProducts ?? '—'} color="#10B981"/>
                <StatCard icon="📦" label="Total Orders" value={stats?.totalOrders ?? '—'} color="#F59E0B"/>
                <StatCard icon="✅" label="Active Rentals" value={stats?.activeRentals ?? '—'} color="#06B6D4"/>
                <StatCard icon="🔧" label="Pending Maintenance" value={stats?.pendingMaintenance ?? '—'} color="#EF4444"/>
                <StatCard icon="💰" label="Total Revenue" value={stats ? `₹${(stats.totalRevenue/1000).toFixed(1)}K` : '—'} color="#8B5CF6"/>
              </div>

              {/* Recent Orders */}
              <div className="admin-section-card">
                <div className="section-card-header">
                  <h3>Recent Orders</h3>
                  <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('orders')}>View All →</button>
                </div>
                {loading ? (
                  <div style={{ padding: 20 }}><div className="spinner"/></div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard?.recentOrders?.map(o => (
                          <tr key={o._id}>
                            <td><span className="order-id-cell">#{o._id.slice(-6).toUpperCase()}</span></td>
                            <td>{o.user?.name}<br/><small>{o.user?.email}</small></td>
                            <td>{o.items[0]?.product?.name || 'N/A'}{o.items.length > 1 ? ` +${o.items.length-1}` : ''}</td>
                            <td><strong>₹{o.totalAmount?.toLocaleString()}</strong></td>
                            <td><span className={`badge badge-${o.status === 'active' ? 'success' : o.status === 'pending' ? 'warning' : 'primary'}`}>{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Category Stats */}
              <div className="admin-section-card">
                <div className="section-card-header"><h3>Product Categories</h3></div>
                <div className="category-bars">
                  {dashboard?.categoryStats?.map(c => {
                    const total = dashboard.categoryStats.reduce((s, x) => s + x.count, 0);
                    const pct = total ? (c.count / total * 100).toFixed(0) : 0;
                    return (
                      <div key={c._id} className="cat-bar">
                        <div className="cat-bar-label">
                          <span>{c._id}</span>
                          <span>{c.count} products ({pct}%)</span>
                        </div>
                        <div className="cat-bar-track">
                          <div className="cat-bar-fill" style={{ width: `${pct}%` }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'maintenance' && <AdminMaintenance />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
