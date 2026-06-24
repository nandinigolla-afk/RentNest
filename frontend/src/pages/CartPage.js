import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './CartPage.css';

const CartPage = () => {
  const { cart, cartTotal, removeFromCart, updateCartItem, clearCart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
  const [deliveryDate, setDeliveryDate] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => sum + (item.product?.monthlyRent || 0) * item.tenureMonths, 0);
  const deposits = items.reduce((sum, item) => sum + (item.product?.securityDeposit || 0), 0);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.pincode || !deliveryDate) {
      toast.error('Please fill all delivery details'); return;
    }
    setCheckingOut(true);
    try {
      const orderItems = items.map(i => ({ product: i.product._id, tenureMonths: i.tenureMonths }));
      await api.post('/orders', { items: orderItems, deliveryAddress: address, deliveryDate });
      await fetchCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/my-orders');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to place order');
    } finally { setCheckingOut(false); }
  };

  const minDate = new Date(); minDate.setDate(minDate.getDate() + 3);

  if (items.length === 0) return (
    <div className="empty-cart">
      <div className="empty-cart-content animate-fade-up">
        <span>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>{items.length} item{items.length !== 1 ? 's' : ''} ready to rent</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map((item, i) => {
              const p = item.product;
              if (!p) return null;
              const totalRent = (p.monthlyRent || 0) * item.tenureMonths;
              return (
                <div key={p._id} className={`cart-item animate-fade-up delay-${(i+1)*100}`}>
                  <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200'} alt={p.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <span className="cart-item-cat">{p.category}</span>
                    <Link to={`/products/${p._id}`}><h3>{p.name}</h3></Link>
                    <div className="cart-item-price">₹{p.monthlyRent?.toLocaleString()}/mo</div>
                    <div className="cart-tenure-selector">
                      <label>Tenure:</label>
                      <select
                        className="form-input"
                        style={{ width: 'auto', padding: '6px 10px' }}
                        value={item.tenureMonths}
                        onChange={e => updateCartItem(p._id, Number(e.target.value))}
                      >
                        {p.tenureOptions?.map(t => (
                          <option key={t.months} value={t.months}>{t.months} months{t.discountPercent > 0 ? ` (-${t.discountPercent}%)` : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <div className="cart-item-total">
                      <div className="item-rent-total">₹{totalRent.toLocaleString()}</div>
                      <div className="item-deposit">+ ₹{p.securityDeposit?.toLocaleString()} deposit</div>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(p._id)}>🗑 Remove</button>
                  </div>
                </div>
              );
            })}
            <div className="cart-actions">
              <button className="btn btn-outline" onClick={() => navigate('/products')}>← Continue Shopping</button>
              <button className="btn btn-danger btn-sm" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <div className="summary-card animate-fade-up delay-200">
              <h3>Order Summary</h3>
              <div className="summary-rows">
                <div className="summary-row"><span>Rent Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="summary-row"><span>Security Deposits</span><span>₹{deposits.toLocaleString()}</span></div>
                <div className="summary-row"><span>Delivery Charge</span><span className="free">FREE</span></div>
                <div className="summary-row total"><span>Total</span><span>₹{(subtotal + deposits).toLocaleString()}</span></div>
              </div>
              <p className="deposit-note-cart">* Security deposit refunded at end of tenure</p>

              {!showCheckout ? (
                <button className="btn btn-primary btn-full" onClick={() => setShowCheckout(true)}>
                  Proceed to Checkout →
                </button>
              ) : (
                <form onSubmit={handleOrder} className="checkout-form">
                  <h4>Delivery Details</h4>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input className="form-input" placeholder="Flat / Building / Street" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} />
                  </div>
                  <div className="two-col">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input className="form-input" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input className="form-input" placeholder="6-digit pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} maxLength={6} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Delivery Date</label>
                    <input className="form-input" type="date" value={deliveryDate} min={minDate.toISOString().split('T')[0]} onChange={e => setDeliveryDate(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" disabled={checkingOut}>
                    {checkingOut ? <span className="btn-spinner"/> : '✓ Place Order'}
                  </button>
                  <button type="button" className="btn btn-outline btn-full" onClick={() => setShowCheckout(false)}>← Back</button>
                </form>
              )}

              <div className="security-badges">
                <span>🔒 Secure Checkout</span>
                <span>🚚 Free Delivery</span>
                <span>🔧 Free Maintenance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
