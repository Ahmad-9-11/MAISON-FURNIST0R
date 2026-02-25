import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || '';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icons defined as function declarations — hoisted ✓
  const STAT_CARDS = [
    { key: 'revenue', label: 'Total Revenue', prefix: '€', icon: RevenueIcon, color: '#b87f53' },
    { key: 'orders', label: 'Orders', prefix: '', icon: OrdersIcon, color: '#6366f1' },
    { key: 'products', label: 'Products', prefix: '', icon: ProductsIcon, color: '#0ea5e9' },
    { key: 'customers', label: 'Customers', prefix: '', icon: CustomersIcon, color: '#10b981' },
  ];

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/admin/orders`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API}/api/admin/products`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([ordersRes, productsRes]) => {
      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
      const customers = new Set(orders.map(o => o.userRef || o.email)).size;
      setStats({ revenue, orders: orders.length, products: products.length, customers });
      setRecentOrders(orders.slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-8 md:p-12">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-xs uppercase tracking-[4px] text-[#b87f53] mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
          {dateStr}
        </p>
        <h1
          className="text-4xl md:text-5xl font-light text-[#1a1a1a] tracking-tight"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
        >
          Dashboard
        </h1>
        <div className="mt-3 h-px w-16 bg-[#b87f53]" />
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-12">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          const value = loading ? '—' : stats[card.key];
          const display = loading ? '—' : (card.prefix + (card.key === 'revenue' ? Number(value).toLocaleString('de-DE', { minimumFractionDigits: 2 }) : value));
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#ede9e3]"
            >
              {/* Gold top border */}
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${card.color}15`, color: card.color }}
                  >
                    <Icon />
                  </div>
                  <span className="text-[10px] uppercase tracking-[3px] text-[#999] font-medium" style={{ fontFamily: 'system-ui, sans-serif' }}>
                    {card.label}
                  </span>
                </div>
                <p
                  className="text-3xl font-light text-[#1a1a1a] mt-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {display}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#ede9e3] overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-[#f0ece6] flex items-center justify-between">
          <h2
            className="text-xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Recent Orders
          </h2>
          <span className="text-[10px] uppercase tracking-[3px] text-[#b87f53]" style={{ fontFamily: 'system-ui, sans-serif' }}>
            Last {recentOrders.length}
          </span>
        </div>

        {loading ? (
          <div className="px-8 py-12 text-center text-sm text-[#999]" style={{ fontFamily: 'system-ui, sans-serif' }}>Loading…</div>
        ) : recentOrders.length === 0 ? (
          <div className="px-8 py-12 text-center text-sm text-[#999]" style={{ fontFamily: 'system-ui, sans-serif' }}>No orders yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#faf9f7]">
                {['Order ID', 'Status', 'Total', 'Date'].map(h => (
                  <th key={h} className="px-8 py-4 text-left text-[10px] uppercase tracking-[3px] text-[#aaa] font-medium" style={{ fontFamily: 'system-ui, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f3f0]">
              {recentOrders.map(order => (
                <tr key={order._id} className="hover:bg-[#faf9f7] transition-colors">
                  <td className="px-8 py-4 font-mono text-xs text-[#666]">#{String(order._id).slice(-8).toUpperCase()}</td>
                  <td className="px-8 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-8 py-4 text-[#1a1a1a] font-medium" style={{ fontFamily: 'system-ui, sans-serif' }}>€{(order.total || 0).toFixed(2)}</td>
                  <td className="px-8 py-4 text-[#999]" style={{ fontFamily: 'system-ui, sans-serif' }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${map[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {status || 'Unknown'}
    </span>
  );
}

// Stat Icons — function declarations (hoisted, safe to reference above in the file)
function RevenueIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function OrdersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}
function ProductsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}
function CustomersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
