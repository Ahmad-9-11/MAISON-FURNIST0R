import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/products/ProductCard';

const API = import.meta.env.VITE_API_URL || '';
const PAGE_SIZE = 12;

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full bg-[#ede9e3] rounded-sm mb-3" />
      <div className="h-4 bg-[#ede9e3] rounded w-3/4 mb-2" />
      <div className="h-4 bg-[#ede9e3] rounded w-1/3" />
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const featured = searchParams.get('featured') || '';
  const newArrival = searchParams.get('newArrival') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const page = searchParams.get('page') || 1;
    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (category) params.set('category', category);
    if (featured) params.set('featured', featured);
    if (newArrival) params.set('newArrival', newArrival);
    if (maxPrice) params.set('maxPrice', maxPrice);
    fetch(`${API}/api/products?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data || []);
          setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, featured, newArrival, maxPrice, searchParams]);

  const pageTitle = category || (featured ? 'Featured Pieces' : newArrival ? 'New Arrivals' : 'Collections');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container-custom min-h-screen py-12"
    >
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[4px] text-[#b87f53] mb-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
          Maison
        </p>
        <h1
          className="text-4xl font-light text-[#111] sm:text-5xl md:text-6xl"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          {pageTitle}
        </h1>
        {!loading && <p className="mt-2 text-sm text-[#aaa]" style={{ fontFamily: 'system-ui, sans-serif' }}>{pagination.total} pieces</p>}
      </div>

      {/* Skeleton grid */}
      {loading && (
        <div className="products-grid mt-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 h-20 w-20 rounded-full bg-[#f5f3f0] flex items-center justify-center">
            <svg className="h-9 w-9 text-[#b87f53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-[#1a1a1a] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            No pieces found
          </h2>
          <p className="text-sm text-[#aaa] mb-8" style={{ fontFamily: 'system-ui, sans-serif' }}>
            This category is currently empty. Explore all collections instead.
          </p>
          <a
            href="/products"
            className="border border-[#b87f53] px-8 py-3 text-sm text-[#b87f53] hover:bg-[#b87f53] hover:text-white transition-all"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            All Collections
          </a>
        </div>
      )}

      {/* Product grid */}
      {!loading && products.length > 0 && (
        <>
          <div className="products-grid mt-4 sm:mt-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?page=${p}${category ? `&category=${category}` : ''}`}
                  className={`w-10 h-10 flex items-center justify-center text-sm transition-colors ${p === pagination.page ? 'bg-[#b87f53] text-white' : 'bg-white text-[#111] border border-[#ede9e3] hover:border-[#b87f53] hover:text-[#b87f53]'}`}
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
