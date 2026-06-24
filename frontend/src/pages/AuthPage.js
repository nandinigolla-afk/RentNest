import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const PasswordInput = ({ value, onChange, placeholder, className }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="password-wrap">
      <input
        className={className}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button type="button" className="eye-btn" onClick={() => setShow(s => !s)} tabIndex={-1}>
        <EyeIcon open={show} />
      </button>
    </div>
  );
};

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '', phone: '', confirm: '' });

  const validateLogin = () => {
    const e = {};
    if (!loginData.email) e.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) e.email = 'Invalid email';
    if (!loginData.password) e.password = 'Password required';
    return e;
  };

  const validateReg = () => {
    const e = {};
    if (!regData.name || regData.name.length < 2) e.name = 'At least 2 characters';
    if (!regData.email) e.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(regData.email)) e.email = 'Invalid email';
    if (!regData.password || regData.password.length < 6) e.password = 'Min 6 characters';
    if (regData.password !== regData.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      const user = await login(loginData.email, loginData.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Invalid credentials' });
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = validateReg();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await register(regData.name, regData.email, regData.password, regData.phone);
      navigate('/');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed' });
    } finally { setLoading(false); }
  };

  const switchTo = (toLogin) => {
    setIsLogin(toLogin);
    setErrors({});
    setLoginData({ email: '', password: '' });
    setRegData({ name: '', email: '', password: '', phone: '', confirm: '' });
  };

  return (
    <div className="auth-page">
      <div className={`auth-container ${isLogin ? 'login-active' : 'register-active'}`}>

        {/* ── Sliding Color Panel ── */}
        <div className="auth-slider">
          {/* Login side content (visible when register is active, panel slides to left) */}
          <div className="slider-inner login-panel-content">
            <div className="slider-illustration">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80"
                alt="Comfortable living room"
                className="slider-img"
              />
              <div className="slider-img-overlay"/>
            </div>
            <div className="slider-text">
              <div className="slider-logo">🏠 RentNest</div>
              <h2>Welcome Back!</h2>
              <p>Sign in to manage your rentals, track orders, and request maintenance support.</p>
              <button className="slider-switch-btn" onClick={() => switchTo(true)}>
                Sign In →
              </button>
            </div>
          </div>
          {/* Register side content (visible when login is active, panel slides to right) */}
          <div className="slider-inner register-panel-content">
            <div className="slider-illustration">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80"
                alt="Modern apartment"
                className="slider-img"
              />
              <div className="slider-img-overlay"/>
            </div>
            <div className="slider-text">
              <div className="slider-logo">🏠 RentNest</div>
              <h2>New Here?</h2>
              <p>Create a free account and start renting premium furniture & appliances today.</p>
              <button className="slider-switch-btn" onClick={() => switchTo(false)}>
                Create Account →
              </button>
            </div>
          </div>
        </div>

        {/* ── Login Form ── */}
        <div className="auth-form-panel form-left">
          <div className="auth-form-inner">
            <div className="form-logo-mobile">🏠 <strong>RentNest</strong></div>
            <div className="form-header">
              <h2>Sign In</h2>
              <p>Welcome back to RentNest</p>
            </div>

            <div className="demo-credentials">
              <p>🔐 Demo Credentials</p>
              <div className="cred-row" onClick={() => setLoginData({ email:'admin@rentnest.com', password:'Admin@123' })}>
                <span className="cred-badge admin">Admin</span>
                <code>admin@rentnest.com / Admin@123</code>
              </div>
              <div className="cred-row" onClick={() => setLoginData({ email:'user@rentnest.com', password:'User@123' })}>
                <span className="cred-badge user">User</span>
                <code>user@rentnest.com / User@123</code>
              </div>
            </div>

            {errors.general && <div className="alert-error">{errors.general}</div>}

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email" placeholder="you@example.com"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <PasswordInput
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                {loading ? <span className="btn-spinner"/> : 'Sign In'}
              </button>
            </form>
            <p className="switch-hint">
              Don't have an account?{' '}
              <button onClick={() => switchTo(false)} className="link-btn">Sign Up</button>
            </p>
          </div>
        </div>

        {/* ── Register Form ── */}
        <div className="auth-form-panel form-right">
          <div className="auth-form-inner">
            <div className="form-logo-mobile">🏠 <strong>RentNest</strong></div>
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Join thousands of happy renters</p>
            </div>

            {errors.general && <div className="alert-error">{errors.general}</div>}

            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  type="text" placeholder="John Doe"
                  value={regData.name}
                  onChange={e => setRegData({ ...regData, name: e.target.value })}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  type="email" placeholder="you@example.com"
                  value={regData.email}
                  onChange={e => setRegData({ ...regData, email: e.target.value })}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone <span style={{color:'var(--text-muted)',fontWeight:400}}>(optional)</span></label>
                <input
                  className="form-input"
                  type="tel" placeholder="+91 9876543210"
                  value={regData.phone}
                  onChange={e => setRegData({ ...regData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <PasswordInput
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Min. 6 characters"
                  value={regData.password}
                  onChange={e => setRegData({ ...regData, password: e.target.value })}
                />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <PasswordInput
                  className={`form-input ${errors.confirm ? 'error' : ''}`}
                  placeholder="Re-enter password"
                  value={regData.confirm}
                  onChange={e => setRegData({ ...regData, confirm: e.target.value })}
                />
                {errors.confirm && <span className="form-error">{errors.confirm}</span>}
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                {loading ? <span className="btn-spinner"/> : 'Create Account'}
              </button>
            </form>
            <p className="switch-hint">
              Already have an account?{' '}
              <button onClick={() => switchTo(true)} className="link-btn">Sign In</button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
