import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Furniture', 'Appliances', 'Electronics'];
const SUBCATEGORIES = {
  Furniture: ['Bed', 'Sofa', 'Table', 'Chair', 'Wardrobe'],
  Appliances: ['Refrigerator', 'Washing Machine', 'AC', 'Microwave'],
  Electronics: ['TV'],
};
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ category: 'All', subcategory: '', minRent: '', maxRent: '', sort: 'newest', search: '' });

  // Re-read URL params whenever the URL changes (handles Navbar links)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category') || 'All';
    const sub = params.get('subcategory') || '';
    const srch = params.get('search') || '';
    setFilters(f => ({ ...f, category: cat, subcategory: sub, search: srch }));
    setPage(1);
  }, [location.search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const q = new URLSearchParams();
    if (filters.category && filters.category !== 'All') q.set('category', filters.category);
    if (filters.subcategory) q.set('subcategory', filters.subcategory);
    if (filters.minRent) q.set('minRent', filters.minRent);
    if (filters.maxRent) q.set('maxRent', filters.maxRent);
    if (filters.sort) q.set('sort', filters.sort);
    if (filters.search) q.set('search', filters.search);
    q.set('page', page);
    q.set('limit', 12);
    try {
      const { data } = await api.get(`/products?${q}`);
      setProducts(data.data);
      setTotal(data.pagination.total);
      setPages(data.pagination.pages);
    } catch (e) {}
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val, ...(key === 'category' ? { subcategory: '' } : {}) }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: 'All', subcategory: '', minRent: '', maxRent: '', sort: 'newest', search: '' });
    setPage(1);
    navigate('/products');
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="container">
          <h1>Browse Products</h1>
          <p>Find the perfect furniture and appliances for your home</p>
          <div className="search-bar-products">
            <input
              className="form-input"
              placeholder="Search products..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container products-layout">
        {/* Sidebar Filters */}
        <aside className={`filter-sidebar ${filterOpen ? 'open' : ''}`}>
          <div className="filter-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filter">Clear All</button>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-options">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${filters.category === cat ? 'active' : ''}`}
                  onClick={() => updateFilter('category', cat)}
                >{cat}</button>
              ))}
            </div>
          </div>

          {SUBCATEGORIES[filters.category] && (
            <div className="filter-group">
              <label className="filter-label">Sub-Category</label>
              <div className="filter-options">
                {SUBCATEGORIES[filters.category].map(s => (
                  <button
                    key={s}
                    className={`filter-chip ${filters.subcategory === s ? 'active' : ''}`}
                    onClick={() => updateFilter('subcategory', filters.subcategory === s ? '' : s)}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="filter-group">
            <label className="filter-label">Monthly Rent (₹)</label>
            <div className="price-range">
              <input className="form-input" type="number" placeholder="Min" value={filters.minRent}
                onChange={e => updateFilter('minRent', e.target.value)} />
              <span>—</span>
              <input className="form-input" type="number" placeholder="Max" value={filters.maxRent}
                onChange={e => updateFilter('maxRent', e.target.value)} />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select className="form-input" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </aside>

        {/* Products */}
        <main className="products-main">
          <div className="products-toolbar">
            <div className="products-count">
              {loading ? 'Loading...' : `${total} product${total !== 1 ? 's' : ''} found`}
              {filters.category !== 'All' && (
                <span className="active-filter-badge"> in {filters.category}{filters.subcategory ? ` › ${filters.subcategory}` : ''}</span>
              )}
            </div>
            <div className="toolbar-right">
              <select className="form-input sort-select" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button className="btn btn-outline btn-sm filter-toggle" onClick={() => setFilterOpen(!filterOpen)}>
                {filterOpen ? '✕ Close' : '⚙ Filters'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="product-grid">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton" style={{ height: 220 }}/>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 12, width: '50%' }}/>
                    <div className="skeleton" style={{ height: 18, width: '80%' }}/>
                    <div className="skeleton" style={{ height: 14, width: '40%' }}/>
                    <div className="skeleton" style={{ height: 38, borderRadius: 8 }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <div className="page-nums">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                      <button key={n} className={`page-num ${n === page ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                    ))}
                  </div>
                  <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
