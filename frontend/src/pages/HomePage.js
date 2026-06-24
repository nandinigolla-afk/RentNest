import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import './HomePage.css';

const categories = [
  { name: 'Beds', icon: '🛏️', query: 'Furniture', sub: 'Bed', color: '#6C3CE1' },
  { name: 'Sofas', icon: '🛋️', query: 'Furniture', sub: 'Sofa', color: '#8B5CF6' },
  { name: 'Refrigerators', icon: '🧊', query: 'Appliances', sub: 'Refrigerator', color: '#10B981' },
  { name: 'Washing Machines', icon: '🫧', query: 'Appliances', sub: 'Washing Machine', color: '#F59E0B' },
  { name: 'Smart TVs', icon: '📺', query: 'Electronics', sub: 'TV', color: '#EF4444' },
  { name: 'Air Conditioners', icon: '❄️', query: 'Appliances', sub: 'AC', color: '#06B6D4' },
  { name: 'Tables', icon: '🪑', query: 'Furniture', sub: 'Table', color: '#8B5CF6' },
  { name: 'Wardrobes', icon: '🚪', query: 'Furniture', sub: 'Wardrobe', color: '#F97316' },
];

const STAT_TARGETS = [
  { value: 50000, display: '50,000+', label: 'Happy Renters', icon: '😊' },
  { value: 10000, display: '10,000+', label: 'Products Available', icon: '🛋️' },
  { value: 25, display: '25+', label: 'Cities Covered', icon: '🌆' },
  { value: 48, display: '4.8★', label: 'Average Rating', icon: '⭐', isRating: true },
];

const howItWorks = [
  { step: '01', title: 'Browse & Select', desc: 'Explore our wide range of furniture and appliances. Filter by category, price, and tenure.', icon: '🔍' },
  { step: '02', title: 'Choose Your Plan', desc: 'Pick your rental tenure from 1 to 24 months. Longer plans come with bigger discounts.', icon: '📋' },
  { step: '03', title: 'Schedule Delivery', desc: 'Choose your preferred delivery date and address. We deliver at your convenience.', icon: '🚚' },
  { step: '04', title: 'Enjoy & Return', desc: 'Use your items hassle-free. Request maintenance anytime. Return or extend when done.', icon: '✅' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer, Bangalore', text: "RentNest made my relocation stress-free. Got my full apartment set up within 2 days!", avatar: 'P', rating: 5 },
  { name: 'Arjun Mehta', role: 'MBA Student, Hyderabad', text: "As a student, buying wasn't an option. RentNest gave me premium furniture at ₹1500/month!", avatar: 'A', rating: 5 },
  { name: 'Sneha Reddy', role: 'Marketing Manager, Pune', text: "The maintenance support is outstanding. A technician came within 24 hours. Highly recommend!", avatar: 'S', rating: 5 },
];

// Animated counter hook
const useCounter = (target, duration = 1800, isRating = false, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  if (isRating) return (count / 10).toFixed(1) + '★';
  if (target >= 1000) return (count >= 1000 ? (count >= 10000 ? count.toLocaleString() : count.toLocaleString()) : count) + (count >= target ? '+' : '');
  return count + (count >= target ? '+' : '');
};

const StatCard = ({ stat, start, index }) => {
  const displayed = useCounter(stat.value, 1800 + index * 200, stat.isRating, start);
  return (
    <div className={`stat-card animate-fade-up delay-${(index + 1) * 100}`}>
      <span className="stat-icon">{stat.icon}</span>
      <div className="stat-value">{displayed}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
};

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?limit=8').then(({ data }) => setFeatured(data.data)).catch(() => {});
  }, []);

  // Trigger counter when stats section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="homepage">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid"/>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className={`hero-particle p${i + 1}`}/>
          ))}
        </div>
        <div className="container hero-content">
          <div className="hero-text animate-fade-up">
            <div className="hero-badge">🏆 India's #1 Furniture Rental Platform</div>
            <h1>
              Live Comfortably,<br/>
              <span className="text-gradient">Move Freely.</span>
            </h1>
            <p>Rent premium furniture & appliances monthly. No large upfront cost. Free delivery. Maintenance included.</p>
            <div className="hero-btns">
              <Link to="/products" className="btn btn-primary btn-lg">Browse Products →</Link>
              <a href="#how-it-works" className="btn btn-outline btn-lg">How It Works</a>
            </div>
            <div className="hero-perks">
              {['Free Delivery', 'Free Maintenance', 'Flexible Plans', 'Easy Returns'].map(p => (
                <span key={p} className="perk">✓ {p}</span>
              ))}
            </div>
          </div>
          <div className="hero-visual animate-fade-up delay-300">
            <div className="hero-card-stack">
              <div className="hero-product-card hc1">
                <span className="hc-img">🛋️</span>
                <div><strong>3-Seater Sofa</strong><p>₹1,200/month</p></div>
              </div>
              <div className="hero-product-card hc2">
                <span className="hc-img">📺</span>
                <div><strong>55" Smart TV</strong><p>₹1,599/month</p></div>
              </div>
              <div className="hero-product-card hc3">
                <span className="hc-img">🛏️</span>
                <div><strong>King Bed</strong><p>₹1,800/month</p></div>
              </div>
              <div className="hero-float-badge badge1">🚚 Free Delivery</div>
              <div className="hero-float-badge badge2">🔧 Free Maintenance</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hero-search animate-fade-up delay-400">
          <form onSubmit={handleSearch} className="search-form container">
            <div className="search-box">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for beds, sofas, refrigerators..."
                className="search-input"
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
            <div className="search-popular">
              <span>Popular:</span>
              {['Sofa', 'Bed', 'Refrigerator', 'TV', 'AC'].map(q => (
                <button key={q} type="button" className="popular-tag" onClick={() => navigate(`/products?search=${q}`)}>
                  {q}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          {STAT_TARGETS.map((s, i) => (
            <StatCard key={s.label} stat={s} start={statsStarted} index={i} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Everything you need for a fully furnished home</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.query}&subcategory=${cat.sub}`}
                className={`category-card animate-fade-up delay-${(i % 4 + 1) * 100}`}
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Most rented items this month</p>
            <Link to="/products" className="btn btn-outline">View All Products →</Link>
          </div>
          {featured.length > 0 ? (
            <div className="product-grid">
              {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="skeleton-grid">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton" style={{ height: 220 }}/>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 14, width: '60%' }}/>
                    <div className="skeleton" style={{ height: 20, width: '90%' }}/>
                    <div className="skeleton" style={{ height: 16, width: '40%' }}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Renting furniture has never been easier</p>
          </div>
          <div className="how-grid">
            {howItWorks.map((step, i) => (
              <div key={step.step} className={`how-card animate-fade-up delay-${(i+1)*100}`}>
                <div className="how-step-num">{step.step}</div>
                <div className="how-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < howItWorks.length - 1 && <div className="how-connector">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Renters Say</h2>
            <p className="section-subtitle">Join 50,000+ happy customers across India</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`testimonial-card animate-fade-up delay-${(i+1)*100}`}>
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <h2>Ready to Furnish Your Home?</h2>
            <p>Start renting in minutes. Free delivery. No hidden charges.</p>
          </div>
          <div className="cta-btns">
            <Link to="/products" className="btn btn-primary btn-lg">Start Browsing</Link>
            <Link to="/auth" className="btn-outline-white btn-lg">Create Free Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
