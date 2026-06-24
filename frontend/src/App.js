import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';
import MaintenancePage from './pages/MaintenancePage';
import AdminDashboard from './pages/AdminDashboard';

import './styles/global.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner"/></div>;
  return user ? children : <Navigate to="/auth" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spinner"/></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const AppLayout = ({ children, noFooter }) => (
  <><Navbar />{children}{!noFooter && <Footer />}</>
);

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
      <Route path="/products/:id" element={<AppLayout><ProductDetail /></AppLayout>} />
      <Route path="/cart" element={<AppLayout><ProtectedRoute><CartPage /></ProtectedRoute></AppLayout>} />
      <Route path="/my-orders" element={<AppLayout><ProtectedRoute><MyOrdersPage /></ProtectedRoute></AppLayout>} />
      <Route path="/profile" element={<AppLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></AppLayout>} />
      <Route path="/maintenance" element={<AppLayout><ProtectedRoute><MaintenancePage /></ProtectedRoute></AppLayout>} />
      <Route path="/admin" element={<AdminRoute><AppLayout noFooter><AdminDashboard /></AppLayout></AdminRoute>} />
      <Route path="*" element={<AppLayout><div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}><span style={{ fontSize:'4rem' }}>404</span><h2>Page not found</h2><a href="/" className="btn btn-primary">Go Home</a></div></AppLayout>} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration:3500, style:{ fontFamily:'Inter, sans-serif', borderRadius:'10px', fontSize:'0.9rem' }, success:{ iconTheme:{ primary:'#10B981', secondary:'#fff' } }, error:{ iconTheme:{ primary:'#EF4444', secondary:'#fff' } } }} />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
