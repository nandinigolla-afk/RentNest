import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [tenure, setTenure] = useState(3);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data.data);
      if (data.data.tenureOptions?.length) setTenure(data.data.tenureOptions[0].months);
    }).catch(() => navigate('/products')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 70 }}>
      <div className="spinner"/>
    </div>
  );

  if (!product) return null;

  const selectedTenure = product.tenureOptions?.find(t => t.months === tenure);
  const discount = selectedTenure?.discountPercent || 0;
  const discountedRent = product.monthlyRent * (1 - discount / 100);
  const totalRent = discountedRent * tenure;

  const handleAddToCart = async () => {
    if (!user) { navigate('/auth'); return; }
    setAdding(true);
    await addToCart(product._id, tenure);
    setAdding(false);
  };

  const conditionColor = { New: 'success', 'Like New': 'primary', Good: 'warning', Fair: 'danger' };

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb animate-fade-in">
          <span onClick={() => navigate('/')} className="bc-link">Home</span> /
          <span onClick={() => navigate('/products')} className="bc-link">Products</span> /
          <span onClick={() => navigate(`/products?category=${product.category}`)} className="bc-link">{product.category}</span> /
          <span>{product.name}</span>
        </div>

        <div className="detail-grid">
          {/* Images */}
          <div className="detail-images animate-slide-left">
            <div className="main-image-wrap">
              <img src={product.images[activeImg] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'} alt={product.name} className="main-image" />
              <span className={`badge badge-${conditionColor[product.condition] || 'primary'} condition-badge`}>{product.condition}</span>
            </div>
            {product.images.length > 1 && (
              <div className="thumb-list">
                {product.images.map((img, i) => (
                  <button key={i} className={`thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`View ${i+1}`}/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info animate-slide-right">
            <div className="detail-category">{product.category} · {product.subcategory}</div>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-brand">by {product.brand}</div>

            {product.ratings.count > 0 && (
              <div className="detail-rating">
                {'★'.repeat(Math.round(product.ratings.average))}{'☆'.repeat(5 - Math.round(product.ratings.average))}
                <span>{product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)</span>
              </div>
            )}

            <div className="detail-availability">
              {product.availableQuantity > 0
                ? <span className="avail">✓ {product.availableQuantity} units available</span>
                : <span className="unavail">✕ Out of stock</span>}
            </div>

            {/* Tenure Selector */}
            <div className="tenure-selector">
              <label>Select Rental Tenure</label>
              <div className="tenure-grid">
                {product.tenureOptions?.map(t => (
                  <button
                    key={t.months}
                    className={`tenure-option ${tenure === t.months ? 'selected' : ''}`}
                    onClick={() => setTenure(t.months)}
                  >
                    <span className="tenure-months">{t.months} months</span>
                    {t.discountPercent > 0 && <span className="tenure-discount">{t.discountPercent}% off</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="detail-pricing">
              <div className="pricing-row">
                <span>Monthly Rent</span>
                <div>
                  {discount > 0 && <span className="original-price">₹{product.monthlyRent.toLocaleString()}</span>}
                  <span className="final-price">₹{Math.round(discountedRent).toLocaleString()}/mo</span>
                </div>
              </div>
              <div className="pricing-row">
                <span>Security Deposit</span>
                <span className="deposit-amount">₹{product.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="pricing-row total-row">
                <span>Total for {tenure} months</span>
                <span className="total-amount">₹{Math.round(totalRent + product.securityDeposit).toLocaleString()}</span>
              </div>
              <p className="deposit-note">* Deposit refundable at end of tenure</p>
            </div>

            {/* Service Areas */}
            <div className="service-areas">
              <label>📍 Available in:</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.serviceAreas?.map(a => <span key={a} className="tag">{a}</span>)}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="detail-actions">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={adding || product.availableQuantity === 0}>
                {adding ? <span className="btn-spinner"/> : '🛒 Add to Cart'}
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => { handleAddToCart(); navigate('/cart'); }}>
                ⚡ Rent Now
              </button>
            </div>

            {/* Perks */}
            <div className="detail-perks">
              {['Free Delivery & Installation', 'Free Maintenance', 'Flexible Extension', 'Easy Returns'].map(p => (
                <div key={p} className="perk-item">✓ {p}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tabs-nav">
            {['details', 'features', 'reviews'].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="tab-content animate-fade-in">
            {activeTab === 'details' && (
              <div>
                <p className="detail-description">{product.description}</p>
                <div className="specs-grid">
                  {product.brand && <div className="spec"><span>Brand</span><strong>{product.brand}</strong></div>}
                  {product.color && <div className="spec"><span>Color</span><strong>{product.color}</strong></div>}
                  {product.condition && <div className="spec"><span>Condition</span><strong>{product.condition}</strong></div>}
                  {product.weight && <div className="spec"><span>Weight</span><strong>{product.weight} kg</strong></div>}
                  {product.dimensions?.length && (
                    <div className="spec"><span>Dimensions</span>
                      <strong>{product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height} {product.dimensions.unit}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'features' && (
              <ul className="features-list">
                {product.features?.map((f, i) => <li key={i} className="feature-item">✓ {f}</li>)}
              </ul>
            )}
            {activeTab === 'reviews' && (
              <div>
                {product.reviews.length === 0
                  ? <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review!</p>
                  : product.reviews.map((r, i) => (
                    <div key={i} className="review-card">
                      <div className="review-header">
                        <div className="review-avatar">{r.user?.name?.charAt(0) || 'U'}</div>
                        <div>
                          <strong>{r.user?.name || 'User'}</strong>
                          <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                        </div>
                      </div>
                      <p>{r.comment}</p>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
