import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';

const API = import.meta.env.VITE_API_URL || '';

export default function WishlistPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch(`${API}/api/users/favorites`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => res.success && setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="font-heading text-2xl text-[#111]">Wishlist</h1>
        <p className="mt-2 text-[#383733]"><Link to="/login" className="text-[#b87f53] underline">Sign in</Link> to view your wishlist.</p>
      </div>
    );
  }

  if (loading) return <div className="container-custom py-16">Loading…</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-custom py-10">
      <h1 className="font-heading text-3xl font-medium text-[#111] mb-8">Wishlist</h1>
      {products.length === 0 ? (
        <p className="text-[#383733]">Your wishlist is empty. <Link to="/products" className="text-[#b87f53] underline">Browse products</Link>.</p>
      ) : (
        <div className="products-grid mt-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
