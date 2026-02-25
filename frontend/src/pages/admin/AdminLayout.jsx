import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f5f3f0]">
      {/* ── Sidebar ────────────────────────────────────────────────── */}
      <aside
        style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
        className="fixed left-0 top-0 h-full w-72 bg-[#0d0d0d] text-white z-[200] flex flex-col shadow-[4px_0_40px_rgba(0,0,0,0.4)]"
      >
        {/* Gold top accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#b87f53] to-transparent shrink-0" />

        {/* Brand */}
        <div className="flex flex-col items-center justify-center py-8 px-6 border-b border-white/5 shrink-0">
          <span className="text-[10px] uppercase tracking-[6px] text-[#b87f53]/70 mb-1">Maison</span>
          <h2 className="text-2xl font-medium tracking-[3px] text-[#e8d5b7] uppercase">Maison</h2>
          <span className="text-[9px] uppercase tracking-[4px] text-white/20 mt-1">Admin Console</span>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#b87f53] to-[#8b5e3c] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[#e8d5b7] truncate font-medium" style={{ fontFamily: 'system-ui, sans-serif' }}>{user.name}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider" style={{ fontFamily: 'system-ui, sans-serif' }}>Administrator</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          <SidebarLink to="/admin" end label="Overview" icon={<DashIcon />} />
          <SidebarLink to="/admin/products" label="Collections" icon={<ProductsIcon />} />
          <SidebarLink to="/admin/orders" label="Orders" icon={<OrdersIcon />} />
          <SidebarLink to="/admin/music" label="Ambience" icon={<MusicIcon />} />
        </nav>

        {/* Footer actions */}
        <div className="shrink-0 border-t border-white/5 p-5 space-y-2">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/40 hover:text-[#e8d5b7] hover:bg-white/5 transition-all group"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            <span className="h-8 w-8 flex items-center justify-center rounded-md bg-white/5 group-hover:bg-[#b87f53]/20 transition-colors">
              <BackIcon />
            </span>
            Back to Store
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all group"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            <span className="h-8 w-8 flex items-center justify-center rounded-md bg-white/5 group-hover:bg-red-400/10 transition-colors">
              <LogoutIcon />
            </span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <main className="ml-72 flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarLink({ to, label, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={{ fontFamily: 'system-ui, sans-serif' }}
      className={({ isActive }) =>
        `flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-[#b87f53]/20 to-transparent text-[#e8d5b7] border-l-2 border-[#b87f53]'
            : 'text-white/40 hover:text-white/70 hover:bg-white/5 border-l-2 border-transparent'
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      {label}
    </NavLink>
  );
}

// Icons — function declarations (hoisted)
function DashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}
function ProductsIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}
function OrdersIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );
}
function MusicIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
    </svg>
  );
}
function BackIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}

