import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleCart = () => openCart?.();

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* ── Desktop Bar ────────────────────────────────────────────── */}
      <div className="relative z-[100] bg-[#e9e6e3] border-b border-[#ddd9d4]" >
        <div className="mx-auto flex h-[58px] max-w-[1600px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 text-xl font-medium uppercase tracking-[2px] text-[#111] hover:text-[#b87f53] transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            Maison
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Home</NavLink>

            {/* Products mega-menu trigger */}
            <div className="group relative">
              <Link to="/products" className="nav-link">Products</Link>

              {/* Mega Menu Panel */}
              <div
                className="invisible absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-[200]"
                style={{ width: '780px' }}
              >
                <div className="bg-[#faf9f7] border border-[#e8e5e0] shadow-[0_20px_60px_rgba(0,0,0,0.12)] rounded-xl overflow-hidden">
                  {/* Gold top accent */}
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#b87f53] to-transparent" />

                  <div className="grid grid-cols-3 gap-0">
                    {/* Column 1: Categories */}
                    <div className="p-8 border-r border-[#ede9e3]">
                      <h3
                        className="text-[11px] uppercase tracking-[4px] text-[#b87f53] mb-5 font-semibold"
                        style={{ fontFamily: 'system-ui, sans-serif' }}
                      >
                        Categories
                      </h3>
                      <ul className="space-y-3">
                        {[
                          { label: 'Sofas', q: 'Sofas' },
                          { label: 'Chairs', q: 'Chairs' },
                          { label: 'Tables', q: 'Tables' },
                          { label: 'Beds', q: 'Beds' },
                          { label: 'Lighting', q: 'Lighting' },
                          { label: 'Outdoor', q: 'Outdoor' },
                          { label: 'Home Decor', q: 'Home Decor' },
                          { label: 'Textiles', q: 'Textiles' },
                        ].map(({ label, q }) => (
                          <li key={q}>
                            <Link
                              to={`/products?category=${encodeURIComponent(q)}`}
                              className="group/link flex items-center gap-2 text-sm text-[#444] hover:text-[#b87f53] transition-colors"
                              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px' }}
                            >
                              <span className="h-px w-0 bg-[#b87f53] transition-all duration-200 group-hover/link:w-4 shrink-0" />
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 2: Featured Collections */}
                    <div className="p-8 border-r border-[#ede9e3]">
                      <h3
                        className="text-[11px] uppercase tracking-[4px] text-[#b87f53] mb-5 font-semibold"
                        style={{ fontFamily: 'system-ui, sans-serif' }}
                      >
                        Collections
                      </h3>
                      <ul className="space-y-3">
                        {[
                          { label: 'Featured Pieces', q: '?featured=true' },
                          { label: 'New Arrivals', q: '?newArrival=true' },
                          { label: 'Under €200', q: '?maxPrice=200' },
                          { label: 'Living Room', q: '?category=Sofas' },
                          { label: 'Bedroom Edit', q: '?category=Beds' },
                        ].map(({ label, q }) => (
                          <li key={label}>
                            <Link
                              to={`/products${q}`}
                              className="group/link flex items-center gap-2 text-sm text-[#444] hover:text-[#b87f53] transition-colors"
                              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px' }}
                            >
                              <span className="h-px w-0 bg-[#b87f53] transition-all duration-200 group-hover/link:w-4 shrink-0" />
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Column 3: Promo / Visual */}
                    <div className="p-8 flex flex-col justify-between bg-[#f5f2ef]">
                      <div>
                        <h3
                          className="text-[11px] uppercase tracking-[4px] text-[#b87f53] mb-3 font-semibold"
                          style={{ fontFamily: 'system-ui, sans-serif' }}
                        >
                          Season Edit
                        </h3>
                        <p
                          className="text-2xl font-light text-[#1a1a1a] leading-snug mb-4"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          Spring / Summer<br />Collection 2026
                        </p>
                        <p className="text-xs text-[#888] leading-relaxed" style={{ fontFamily: 'system-ui, sans-serif' }}>
                          Pieces crafted for warmth, natural materials, and effortless living.
                        </p>
                      </div>
                      <Link
                        to="/products?newArrival=true"
                        className="mt-6 inline-block text-xs uppercase tracking-[3px] text-[#b87f53] border-b border-[#b87f53]/50 pb-0.5 hover:border-[#b87f53] transition-colors"
                        style={{ fontFamily: 'system-ui, sans-serif' }}
                      >
                        Shop New Arrivals →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>About</NavLink>
            <NavLink to="/journal" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Journal</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Contact</NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Auth-aware links */}
            {!user ? (
              <div className="hidden lg:flex items-center gap-4">
                <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Login</NavLink>
                <Link
                  to="/signup"
                  className="rounded-full border border-[#b87f53] px-5 py-1.5 text-sm text-[#b87f53] hover:bg-[#b87f53] hover:text-white transition-all"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>Profile</NavLink>
                {user.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className="text-sm font-medium tracking-wider text-[#b87f53] border border-[#b87f53]/40 px-4 py-1.5 rounded-full hover:bg-[#b87f53] hover:text-white transition-all"
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    Admin
                  </NavLink>
                )}
                <button onClick={handleLogout} className="nav-link text-[#888] hover:text-red-500">Sign Out</button>
              </div>
            )}

            {/* Cart */}
            <button
              type="button"
              onClick={toggleCart}
              aria-label="Open cart"
              className="relative flex items-center gap-1.5 text-[#111] hover:text-[#b87f53] transition-colors"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
              </svg>
              <span className="text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-[#b87f53] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="flex lg:hidden flex-col gap-1.5 p-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <div className="h-0.5 w-6 bg-[#333]" />
              <div className="h-0.5 w-6 bg-[#333]" />
              <div className="h-0.5 w-6 bg-[#333]" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 z-[1000] flex h-full w-80 flex-col bg-[#e9e6e3] shadow-2xl"
          >
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#b87f53] to-transparent shrink-0" />
            <div className="flex items-center justify-between p-6 border-b border-[#ddd9d4]">
              <span className="text-lg font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Menu</span>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-2xl text-[#111] hover:text-[#b87f53]">✕</button>
            </div>
            <ul className="flex-1 overflow-y-auto list-none p-6 space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/about', label: 'About' },
                { to: '/journal', label: 'Journal' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="block text-3xl font-light text-[#111] hover:text-[#b87f53] py-2 transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <Link to="/profile" className="block text-3xl font-light text-[#111] hover:text-[#b87f53] py-2 transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }} onClick={() => setMobileOpen(false)}>
                    Profile
                  </Link>
                </li>
              )}
              {user?.role === 'admin' && (
                <li>
                  <Link to="/admin" className="block text-3xl font-light text-[#b87f53] hover:text-[#cf5600] py-2 transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }} onClick={() => setMobileOpen(false)}>
                    Admin
                  </Link>
                </li>
              )}
            </ul>
            <div className="border-t border-[#ddd9d4] p-6 space-y-3">
              {!user ? (
                <>
                  <Link to="/login" className="block w-full text-center border border-[#b87f53] py-3 text-[#b87f53] hover:bg-[#b87f53] hover:text-white transition-all text-sm" style={{ fontFamily: 'system-ui, sans-serif' }} onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link to="/signup" className="block w-full text-center bg-[#b87f53] py-3 text-white hover:bg-[#a06d47] transition-all text-sm" style={{ fontFamily: 'system-ui, sans-serif' }} onClick={() => setMobileOpen(false)}>Create Account</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="w-full text-left text-sm text-[#888] hover:text-red-500 transition-colors py-2" style={{ fontFamily: 'system-ui, sans-serif' }}>Sign Out</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
