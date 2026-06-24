import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminComponents.css';

const EMPTY = {
  name: '', description: '', category: 'Furniture', subcategory: 'Bed',
  monthlyRent: '', securityDeposit: '', brand: '', condition: 'New',
  availableQuantity: 1, totalQuantity: 1, color: '',
  serviceAreas: 'Hyderabad, Bangalore',
  images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
  features: '',
  tenureOptions: [
    { months: 3, discountPercent: 0 },
    { months: 6, discountPercent: 5 },
    { months: 12, discountPercent: 10 },
  ],
};

const SUBCATS = {
  Furniture: ['Bed','Sofa','Table','Chair','Wardrobe'],
  Appliances: ['Refrigerator','Washing Machine','AC','Microwave'],
  Electronics: ['TV'],
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 10, ...(search && { search }) });
      const { data } = await api.get(`/products?${q}`);
      setProducts(data.data);
      setTotal(data.pagination.total);
    } catch (e) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      ...p,
      serviceAreas: p.serviceAreas?.join(', ') || '',
      features: p.features?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        monthlyRent: Number(form.monthlyRent),
        securityDeposit: Number(form.securityDeposit),
        availableQuantity: Number(form.availableQuantity),
        totalQuantity: Number(form.totalQuantity),
        serviceAreas: typeof form.serviceAreas === 'string' ? form.serviceAreas.split(',').map(s => s.trim()).filter(Boolean) : form.serviceAreas,
        features: typeof form.features === 'string' ? form.features.split(',').map(s => s.trim()).filter(Boolean) : form.features,
        images: Array.isArray(form.images) ? form.images : [form.images],
      };
      if (editing) {
        await api.put(`/products/${editing}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product removed');
      fetchProducts();
    } catch (e) { toast.error('Failed'); }
  };

  const updateTenure = (idx, field, val) => {
    const t = [...form.tenureOptions];
    t[idx] = { ...t[idx], [field]: Number(val) };
    setForm(f => ({ ...f, tenureOptions: t }));
  };

  return (
    <div className="admin-comp">
      <div className="comp-header">
        <div className="comp-search">
          <input className="form-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>
      <p className="comp-count">{total} products total</p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Product</th><th>Category</th><th>Rent/mo</th><th>Deposit</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }}/></td></tr>
            ) : products.map(p => (
              <tr key={p._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={p.images?.[0]} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}/>
                    <div>
                      <strong style={{ display: 'block' }}>{p.name}</strong>
                      <small>{p.brand}</small>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-primary">{p.category}</span><br/><small>{p.subcategory}</small></td>
                <td><strong>₹{p.monthlyRent?.toLocaleString()}</strong></td>
                <td>₹{p.securityDeposit?.toLocaleString()}</td>
                <td>
                  <span className={`badge ${p.availableQuantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {p.availableQuantity}/{p.totalQuantity}
                  </span>
                </td>
                <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="comp-pagination">
        <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
        <span>Page {page}</span>
        <button className="btn btn-outline btn-sm" disabled={products.length < 10} onClick={() => setPage(p => p + 1)}>Next →</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input className="form-input" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value, subcategory: SUBCATS[e.target.value]?.[0] || '' }))}>
                    {['Furniture','Appliances','Electronics'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Sub-Category</label>
                  <select className="form-input" value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}>
                    {(SUBCATS[form.category] || []).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Monthly Rent (₹) *</label>
                  <input className="form-input" type="number" value={form.monthlyRent} onChange={e => setForm(f => ({ ...f, monthlyRent: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Security Deposit (₹) *</label>
                  <input className="form-input" type="number" value={form.securityDeposit} onChange={e => setForm(f => ({ ...f, securityDeposit: e.target.value }))} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Available Qty</label>
                  <input className="form-input" type="number" value={form.availableQuantity} onChange={e => setForm(f => ({ ...f, availableQuantity: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Qty</label>
                  <input className="form-input" type="number" value={form.totalQuantity} onChange={e => setForm(f => ({ ...f, totalQuantity: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Condition</label>
                  <select className="form-input" value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
                    {['New','Like New','Good','Fair'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL(s) (comma-separated)</label>
                <input className="form-input" value={Array.isArray(form.images) ? form.images.join(', ') : form.images}
                  onChange={e => setForm(f => ({ ...f, images: e.target.value.split(',').map(s => s.trim()) }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Features (comma-separated)</label>
                <input className="form-input" value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder="Feature 1, Feature 2" />
              </div>
              <div className="form-group">
                <label className="form-label">Service Areas (comma-separated)</label>
                <input className="form-input" value={form.serviceAreas} onChange={e => setForm(f => ({ ...f, serviceAreas: e.target.value }))} placeholder="Hyderabad, Bangalore" />
              </div>
              <div className="form-group">
                <label className="form-label">Tenure Options</label>
                <div className="tenure-rows">
                  {form.tenureOptions.map((t, i) => (
                    <div key={i} className="tenure-row">
                      <input className="form-input" type="number" placeholder="Months" value={t.months} onChange={e => updateTenure(i, 'months', e.target.value)} />
                      <input className="form-input" type="number" placeholder="Discount %" value={t.discountPercent} onChange={e => updateTenure(i, 'discountPercent', e.target.value)} />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>months / % off</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="btn-spinner"/> : (editing ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
