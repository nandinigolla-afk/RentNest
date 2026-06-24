import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminComponents.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 15, ...(search && { search }) });
      const { data } = await api.get(`/admin/users?${q}`);
      setUsers(data.data);
      setTotal(data.pagination.total);
    } catch (e) { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const toggleActive = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}`, { isActive: !user.isActive, role: user.role });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (e) { toast.error('Failed'); }
  };

  const toggleRole = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}`, { role: user.role === 'admin' ? 'user' : 'admin', isActive: user.isActive });
      toast.success('Role updated');
      fetchUsers();
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <div className="admin-comp">
      <div className="comp-header">
        <input className="form-input" style={{ maxWidth: 300 }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <p className="comp-count">{total} users total</p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>User</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }}/></td></tr>
            ) : users.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="admin-avatar" style={{ width: 36, height: 36, fontSize: '0.9rem', flexShrink: 0 }}>{u.name?.charAt(0)}</div>
                    <div>
                      <strong>{u.name}</strong>
                      <small style={{ display: 'block' }}>{u.email}</small>
                    </div>
                  </div>
                </td>
                <td>{u.phone || '—'}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>{u.role}</span>
                </td>
                <td>
                  <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleRole(u)}>
                      {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </button>
                    <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-primary'}`} onClick={() => toggleActive(u)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comp-pagination">
        <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
        <span>Page {page}</span>
        <button className="btn btn-outline btn-sm" disabled={users.length < 15} onClick={() => setPage(p => p + 1)}>Next →</button>
      </div>
    </div>
  );
};

export default AdminUsers;
