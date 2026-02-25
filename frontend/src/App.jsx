import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminRoute from './components/auth/AdminRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/layout/ScrollToTop';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailWaitingPage from './pages/VerifyEmailWaitingPage';
import VerifyEmailTokenPage from './pages/VerifyEmailTokenPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import WishlistPage from './pages/WishlistPage';
import MusicManagementPage from './pages/admin/MusicManagementPage';
import ProfilePage from './pages/ProfilePage';
import { MusicProvider } from './context/MusicContext';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/shop" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<div className="container-custom py-16 font-heading text-2xl">About</div>} />
          <Route path="/journal" element={<div className="container-custom py-16 font-heading text-2xl">Journal</div>} />
          <Route path="/contact" element={<div className="container-custom py-16 font-heading text-2xl">Contact</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailWaitingPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailTokenPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />

          {/* Protected routes (require login + email verified) */}
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin routes (require admin role) */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="music" element={<MusicManagementPage />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MusicProvider>
          <CartProvider>
            <ScrollToTop />
            <Layout>
              <AppRoutes />
            </Layout>
          </CartProvider>
        </MusicProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
