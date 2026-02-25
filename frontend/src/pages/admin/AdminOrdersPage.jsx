import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || '';
const STATUS_OPTIONS = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/orders`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => res.success && setOrders(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (orderId, status) => {
    fetch(`${API}/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    })
      .then((r) => r.json())
      .then((res) => res.success && setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o))));
  };

  if (loading) return <p className="text-[#383733]">Loading…</p>;

  return (
    <div className="p-8 md:p-12">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-xs uppercase tracking-[4px] text-[#b87f53] mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
          Management
        </p>
        <h1
          className="text-4xl md:text-5xl font-light text-[#1a1a1a] tracking-tight"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
        >
          Orders
        </h1>
        <div className="mt-3 h-px w-16 bg-[#b87f53]" />
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl p-20 text-center border border-[#e5e7eb]">
            <p className="text-gray-400 italic">Historical records are currently empty.</p>
          </div>
        )}
        {orders.map((o) => (
          <div key={o._id} className="rounded-2xl bg-white border border-[#e5e7eb] p-10 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#f3f4f6] pb-8 mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Acquisition #{o._id.slice(-6).toUpperCase()}</p>
                <h3 className="font-heading text-2xl text-[#111]">{o.userRef?.name || o.userRef?.email || 'Anonymous Collector'}</h3>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5 border border-[#e5e7eb] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-tighter">
                    {o.paymentMethod}
                  </span>
                  <span>·</span>
                  <span className="font-medium text-[#111]">€{o.total?.toFixed(2)}</span>
                  <span>·</span>
                  <span className="italic">{new Date(o.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="relative">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className={`appearance-none rounded-xl border border-[#e5e7eb] pl-6 pr-12 py-3 text-sm font-semibold focus:outline-none focus:border-[#b87f53] transition-colors cursor-pointer ${
                    o.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' : 
                    o.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-10">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">Curated Selection</h4>
                <div className="space-y-4">
                  {o.items?.map((i, idx) => (
                    <div key={idx} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-50 border border-[#f3f4f6]">
                          <img src={i.image} alt="" className="h-full w-full object-cover" />
                        </div>
                        <p className="text-sm font-medium text-[#111]">{i.title} <span className="text-gray-400 mx-2">×</span> {i.quantity}</p>
                      </div>
                      <p className="text-sm text-gray-500">€{(i.price * i.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#faf9f8] rounded-xl p-6 border border-[#f1f0ee]">
                <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Destination</h4>
                <div className="text-xs text-gray-600 leading-relaxed font-medium">
                  <p>{o.address?.street}</p>
                  <p>{o.address?.city} {o.address?.postalCode}</p>
                  <p className="uppercase tracking-wider mt-1">{o.address?.country}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
