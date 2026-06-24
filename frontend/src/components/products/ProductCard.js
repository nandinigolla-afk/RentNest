import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    setAdding(true);
    await addToCart(product._id, 3);
    setAdding(false);
  };

  const img = product.images?.[imgIdx] || `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400`;

  const stars = (avg) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(avg) ? 'star filled' : 'star'}> ★</span>
    ));
  };

  return (
    <div
      className="product-card animate-fade-up"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <Link to={`/products/${product._id}`} className="product-card-img-wrap">
        <img
          src={img}
          alt={product.name}
          className="product-card-img"
          onMouseEnter={() => product.images?.length > 1 && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
          loading="lazy"
        />
        <span className="product-category-tag">{product.category}</span>
        {product.availableQuantity === 0 && (
          <span className="out-of-stock-badge">Out of Stock</span>
        )}
        <button
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>
        {product.tenureOptions?.some(t => t.discountPercent > 0) && (
          <span className="discount-tag">Up to {Math.max(...product.tenureOptions.map(t => t.discountPercent))}% off</span>
        )}
      </Link>

      <div className="product-card-body">
        <div className="product-brand">{product.brand}</div>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        {product.ratings?.count > 0 && (
          <div className="product-rating">
            {stars(product.ratings.average)}
            <span>({product.ratings.count})</span>
          </div>
        )}
        <div className="product-price-row">
          <div>
            <span className="monthly-rent">₹{product.monthlyRent?.toLocaleString()}</span>
            <span className="per-month">/mo</span>
          </div>
          <div className="deposit-info">
            <span>Deposit:</span>
            <span>₹{product.securityDeposit?.toLocaleString()}</span>
          </div>
        </div>
        <div className="tenure-chips">
          {product.tenureOptions?.slice(0, 3).map(t => (
            <span key={t.months} className="tenure-chip">{t.months}M</span>
          ))}
        </div>
        <button
          className={`btn btn-primary btn-full add-cart-btn ${adding ? 'loading' : ''}`}
          onClick={handleAddToCart}
          disabled={adding || product.availableQuantity === 0}
        >
          {adding ? (
            <span className="btn-spinner"/>
          ) : product.availableQuantity === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
