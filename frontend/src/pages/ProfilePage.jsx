import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/orders`, { credentials: 'include' })
      .then(r => r.json())
      .then(res => setOrders(res.data || res.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const statusStyle = {
    Pending:    'bg-amber-50 text-amber-700 border-amber-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped:    'bg-indigo-50 text-indigo-700 border-indigo-200',
    Delivered:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled:  'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="container-custom py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[4px] text-[#b87f53] mb-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
            My Account
          </p>
          <h1
            className="text-4xl md:text-5xl font-light text-[#1a1a1a]"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            {user?.name || 'Valued Collector'}
          </h1>
          <div className="mt-3 h-px w-16 bg-[#b87f53]" />
        </div>

        {/* ── Profile Card ───────────────────────────────────────── */}
        <div className="bg-white border border-[#ede9e3] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden mb-8">
          <div className="h-0.5 w-full bg-gradient-to-r from-[#b87f53] via-[#c99a6f] to-transparent" />
          <div className="p-8 md:p-10 flex flex-wrap items-center gap-6">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#b87f53] to-[#8b5e3c] flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#888] mb-0.5" style={{ fontFamily: 'system-ui, sans-serif' }}>Email</p>
              <p className="font-medium text-[#1a1a1a] truncate" style={{ fontFamily: 'system-ui, sans-serif' }}>{user?.email}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${user?.isEmailVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {user?.isEmailVerified ? '✓ Verified' : '⚠ Unverified'}
                </span>
                <span className="inline-flex items-center rounded-full border border-[#ede9e3] bg-[#faf9f7] px-3 py-0.5 text-[10px] uppercase tracking-wider font-semibold text-[#888]" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {user?.role || 'Customer'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <p className="text-[10px] uppercase tracking-[3px] text-[#aaa] text-right" style={{ fontFamily: 'system-ui, sans-serif' }}>Member Since</p>
              <p className="text-sm font-medium text-[#1a1a1a]" style={{ fontFamily: 'system-ui, sans-serif' }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'February 2026'}
              </p>
              <button
                onClick={handleLogout}
                className="mt-2 text-xs text-[#888] hover:text-red-500 transition-colors text-right"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                Sign Out →
              </button>
            </div>
          </div>
        </div>

        {/* ── Order History ──────────────────────────────────────── */}
        <div className="bg-white border border-[#ede9e3] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-8 py-6 border-b border-[#f0ece6] flex items-center justify-between">
            <h2
              className="text-2xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              Order History
            </h2>
            <span className="text-[10px] uppercase tracking-[3px] text-[#b87f53]" style={{ fontFamily: 'system-ui, sans-serif' }}>
              {ordersLoading ? '—' : `${orders.length} ${orders.length === 1 ? 'Order' : 'Orders'}`}
            </span>
          </div>

          {/* Loading skeletons */}
          {ordersLoading && (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-xl bg-[#f5f3f0] animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!ordersLoading && orders.length === 0 && (
            <div className="px-8 py-16 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#f5f3f0] flex items-center justify-center">
                <svg className="h-7 w-7 text-[#b87f53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <p className="text-lg text-[#888]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                No orders yet
              </p>
              <p className="text-sm text-[#aaa] mt-1 mb-6" style={{ fontFamily: 'system-ui, sans-serif' }}>
                Your curated acquisitions will appear here.
              </p>
              <Link
                to="/products"
                className="inline-block border border-[#b87f53] px-8 py-3 text-sm text-[#b87f53] hover:bg-[#b87f53] hover:text-white transition-all"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                Explore Collections
              </Link>
            </div>
          )}

          {/* Orders list */}
          {!ordersLoading && orders.length > 0 && (
            <div className="divide-y divide-[#f5f3f0]">
              {orders.map(order => {
                const isExpanded = expandedOrder === order._id;
                const badge = statusStyle[order.status] || 'bg-gray-50 text-gray-600 border-gray-200';
                return (
                  <div key={order._id}>
                    {/* Order row (always visible) */}
                    <button
                      type="button"
                      onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                      className="w-full px-8 py-5 flex flex-wrap items-center gap-4 hover:bg-[#faf9f7] transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[11px] text-[#999]">
                          #{String(order._id).slice(-10).toUpperCase()}
                        </p>
                        <p className="text-sm font-medium text-[#1a1a1a] mt-0.5" style={{ fontFamily: 'system-ui, sans-serif' }}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                        </p>
                      </div>
                      <span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${badge}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
                        {order.status || 'Pending'}
                      </span>
                      <p className="text-lg font-light text-[#1a1a1a] shrink-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        €{(order.total || 0).toFixed(2)}
                      </p>
                      <svg
                        className={`h-4 w-4 text-[#aaa] shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expanded order items */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 pb-6 bg-[#faf9f7]">
                            <div className="pt-4 space-y-3">
                              {(order.items || []).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                  {/* Thumbnail */}
                                  <div className="h-14 w-14 rounded-lg overflow-hidden border border-[#ede9e3] bg-[#f0ece6] shrink-0">
                                    {item.image ? (
                                      <img src={item.image} alt={item.title || item.name} className="h-full w-full object-cover" />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center text-[#ccc]">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#1a1a1a] truncate" style={{ fontFamily: 'system-ui, sans-serif' }}>
                                      {item.title || item.name || 'Product'}
                                    </p>
                                    <p className="text-xs text-[#999]" style={{ fontFamily: 'system-ui, sans-serif' }}>
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="text-sm text-[#444] shrink-0" style={{ fontFamily: 'system-ui, sans-serif' }}>
                                    €{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                              {(!order.items || order.items.length === 0) && (
                                <p className="text-sm text-[#aaa]" style={{ fontFamily: 'system-ui, sans-serif' }}>No item details available.</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
