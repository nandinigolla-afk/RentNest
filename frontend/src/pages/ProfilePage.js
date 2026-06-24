import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', pincode: user?.address?.pincode || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});

  const handleProfileSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const { data } = await api.put('/auth/update-profile', {
        name: form.name, phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
      });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = 'Required';
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) errs.newPassword = 'Min 6 characters';
    if (pwForm.newPassword !== pwForm.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwErrors({}); setSaving(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar animate-slide-left">
            <div className="profile-avatar-section">
              <div className="profile-avatar-big">{user?.name?.charAt(0)}</div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
              <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>{user?.role}</span>
            </div>
            <nav className="profile-nav">
              {[['profile','👤 My Profile'], ['password','🔒 Change Password'], ['stats','📊 Account Stats']].map(([id, label]) => (
                <button key={id} className={`profile-nav-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="profile-content animate-slide-right">
            {tab === 'profile' && (
              <div className="profile-card">
                <h2>Personal Information</h2>
                <form onSubmit={handleProfileSave} className="profile-form">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Email cannot be changed</small>
                  </div>
                  <h3 style={{ fontSize: '1rem', marginTop: 8 }}>Default Address</h3>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input className="form-input" placeholder="Flat/Building/Street" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} />
                  </div>
                  <div className="form-row-3">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input className="form-input" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input className="form-input" maxLength={6} value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="btn-spinner"/> : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'password' && (
              <div className="profile-card">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange} className="profile-form" style={{ maxWidth: 400 }}>
                  {[['currentPassword','Current Password'], ['newPassword','New Password'], ['confirm','Confirm New Password']].map(([key, label]) => (
                    <div className="form-group" key={key}>
                      <label className="form-label">{label}</label>
                      <input className={`form-input ${pwErrors[key] ? 'error' : ''}`} type="password"
                        value={pwForm[key]} onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))} />
                      {pwErrors[key] && <span className="form-error">{pwErrors[key]}</span>}
                    </div>
                  ))}
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="btn-spinner"/> : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'stats' && (
              <div className="profile-card">
                <h2>Account Information</h2>
                <div className="account-stats">
                  <div className="account-stat"><span>📅</span><div><strong>Member Since</strong><p>{new Date(user?.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p></div></div>
                  <div className="account-stat"><span>✅</span><div><strong>Account Status</strong><p>{user?.isActive ? 'Active' : 'Inactive'}</p></div></div>
                  <div className="account-stat"><span>🎭</span><div><strong>Account Role</strong><p style={{ textTransform: 'capitalize' }}>{user?.role}</p></div></div>
                  <div className="account-stat"><span>🆔</span><div><strong>User ID</strong><p style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{user?._id}</p></div></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
