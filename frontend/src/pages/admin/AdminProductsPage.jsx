import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || '';
const LOW_STOCK_THRESHOLD = 5;
const CATEGORIES = ['Sofas', 'Tables', 'Lighting', 'Chairs', 'Beds', 'Textiles', 'Outdoor', 'Home Decor'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', brand: '', price: '', description: '', category: 'Chairs', material: '', stock: '', images: '', isFeatured: false, isNewArrival: false });

  const load = () => {
    fetch(`${API}/api/admin/products`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => res.success && setProducts(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id) => {
    if (!confirm('Delete this product?')) return;
    fetch(`${API}/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include' })
      .then((r) => r.json())
      .then((res) => res.success && load());
  };

  const handleEdit = (p) => {
    setEditing(p._id);
    setForm({
      title: p.title || '',
      brand: p.brand || '',
      price: p.price ?? '',
      description: p.description || '',
      category: p.category || 'Chairs',
      material: p.material || '',
      stock: p.stock ?? '',
      images: (p.images || []).join('\n'),
      isFeatured: !!p.isFeatured,
      isNewArrival: !!p.isNewArrival,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock, 10) || 0,
      images: form.images.trim() ? form.images.trim().split('\n').map((s) => s.trim()).filter(Boolean) : [],
    };
    const url = editing ? `${API}/api/admin/products/${editing}` : `${API}/api/admin/products`;
    const method = editing ? 'PATCH' : 'POST';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((res) => { if (res.success) { setEditing(null); setForm({ title: '', brand: '', price: '', description: '', category: 'Chairs', material: '', stock: '', images: '', isFeatured: false, isNewArrival: false }); load(); } });
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', brand: '', price: '', description: '', category: 'Chairs', material: '', stock: '', images: '', isFeatured: false, isNewArrival: false });
  };

  if (loading) return <p className="text-[#383733]">Loading…</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-12">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[4px] text-[#b87f53] mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
          Inventory
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              className="text-4xl md:text-5xl font-light text-[#1a1a1a] tracking-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              Collections
            </h1>
            <div className="mt-3 h-px w-16 bg-[#b87f53]" />
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-full bg-[#1a1a1a] px-8 py-3 text-sm font-medium text-white shadow-lg hover:bg-[#b87f53] transition-all duration-300"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            + Add New Piece
          </button>
        </div>
      </div>

      {(editing || (!editing && form.title)) && (
        <form onSubmit={handleSubmit} className="mb-12 rounded-2xl bg-white border border-[#e5e7eb] p-10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="font-heading text-3xl font-light text-[#111] mb-8">{editing ? 'Refine Masterpiece' : 'New Creation'}</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Piece Title</label>
              <input type="text" placeholder="e.g. Velvet Armchair" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full border-b border-[#e5e7eb] py-3 focus:border-[#b87f53] focus:outline-none transition-colors" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Maison / Brand</label>
              <input type="text" placeholder="Brand name" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="w-full border-b border-[#e5e7eb] py-3 focus:border-[#b87f53] focus:outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Investment (€)</label>
              <input type="number" step="0.01" placeholder="0.00" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="w-full border-b border-[#e5e7eb] py-3 focus:border-[#b87f53] focus:outline-none transition-colors" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full border-b border-[#e5e7eb] py-3 focus:border-[#b87f53] focus:outline-none bg-white transition-colors cursor-pointer">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Materiality</label>
              <input type="text" placeholder="e.g. Oak, Velvet" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} className="w-full border-b border-[#e5e7eb] py-3 focus:border-[#b87f53] focus:outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">In Inventory</label>
              <input type="number" placeholder="Quantity" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="w-full border-b border-[#e5e7eb] py-3 focus:border-[#b87f53] focus:outline-none transition-colors" required />
            </div>
            
            <div className="flex gap-8 sm:col-span-3 py-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 rounded border-[#e5e7eb] text-[#b87f53] focus:ring-[#b87f53]" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-[#b87f53] transition-colors">Featured Selection</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm((f) => ({ ...f, isNewArrival: e.target.checked }))} className="w-4 h-4 rounded border-[#e5e7eb] text-[#b87f53] focus:ring-[#b87f53]" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-[#b87f53] transition-colors">New Arrival</span>
              </label>
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold block mb-2">Narrative / Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-[#e5e7eb] rounded-xl p-4 focus:border-[#b87f53] focus:outline-none transition-colors" />
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold block mb-2">Visual Showcase (Image URLs, one per line)</label>
              <textarea value={form.images} onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))} rows={3} className="w-full border border-[#e5e7eb] rounded-xl p-4 focus:border-[#b87f53] focus:outline-none transition-colors font-mono text-xs" placeholder="https://..." />
            </div>
          </div>
          <div className="mt-10 flex gap-4">
            <button type="submit" className="rounded-full bg-[#b87f53] px-10 py-3 text-sm font-semibold text-white hover:bg-[#a06d47] transition-all shadow-md">Complete Piece</button>
            <button type="button" onClick={() => setEditing(null) || setForm({ title: '', brand: '', price: '', description: '', category: 'Chairs', material: '', stock: '', images: '', isFeatured: false, isNewArrival: false })} className="rounded-full border border-[#e5e7eb] px-10 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all">Discard</button>
          </div>
        </form>
      )}

      <div className="rounded-2xl bg-white border border-[#e5e7eb] overflow-hidden shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#faf9f8] border-b border-[#e5e7eb]">
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Visual</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Masterpiece</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Category</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Investment</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Availability</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {products.map((p) => (
              <tr key={p._id} className={`group hover:bg-[#fafafa] transition-colors ${(p.stock ?? 0) < LOW_STOCK_THRESHOLD ? 'bg-red-50/30' : ''}`}>
                <td className="px-8 py-6">
                  <div className="h-16 w-16 overflow-hidden rounded-xl border border-[#e5e7eb] shadow-sm">
                    <img src={p.images?.[0] || p.img} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-heading text-xl text-[#111] leading-tight">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">{p.brand || 'Original Maison'}</p>
                </td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {p.category}
                  </span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#111]">€{p.price?.toFixed(2)}</td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className={`text-sm ${(p.stock ?? 0) < LOW_STOCK_THRESHOLD ? 'font-semibold text-red-600' : 'text-gray-600'}`}>
                      {p.stock ?? 0} in stock
                    </span>
                    {(p.stock ?? 0) < LOW_STOCK_THRESHOLD && (
                      <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider mt-0.5">Limited Stock</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => handleEdit(p)} className="text-[#b87f53] opacity-0 group-hover:opacity-100 font-medium hover:underline transition-all">Edit</button>
                    <button type="button" onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
