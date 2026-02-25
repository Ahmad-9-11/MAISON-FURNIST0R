import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import ProductCard from '../components/products/ProductCard';

const API = import.meta.env.VITE_API_URL || '';

const shopByRoom = [
  { name: 'Living Room', img: 'https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/high-back-lounge-armchair-4-500x666.jpg', slug: 'Sofas' },
  { name: 'Bed Room', img: 'https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/double-fabric-bed-3-500x666.jpg', slug: 'Beds' },
  { name: 'Dining Room', img: 'https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/stackist-12-500x666.jpg', slug: 'Chairs' },
  { name: 'Home Decore', img: 'https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/check-wool-5-500x666.jpeg', slug: 'Home Decor' },
  { name: 'Lighting', img: 'https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/04/luna-floor-lamp-2-500x666.jpg', slug: 'Lighting' },
  { name: 'Outdoor', img: 'https://sites.kaliumtheme.com/elementor/furniture/wp-content/uploads/2025/05/round-steel-garden-table-13-500x666.jpg', slug: 'Outdoor' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/products?limit=8`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length) setProducts(data.data);
        else setProducts([]);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <div className="container-custom border-b border-[#ccc9c1]">
        <h2 className="font-heading text-3xl font-light text-[#111] sm:text-4xl md:text-5xl">Shop by room</h2>
        <div className="shop-by-room-grid mt-8 sm:mt-10 md:mt-12">
          {shopByRoom.map((room) => (
            <Link
              key={room.slug}
              to={`/products?category=${room.slug}`}
              className="group relative block w-full overflow-hidden rounded-sm bg-[#f3f1ef] aspect-[3/4] min-h-[180px] sm:min-h-[220px]"
            >
              <img
                src={room.img}
                alt={room.name}
                className="absolute inset-0 h-full w-full object-cover brightness-[0.85] transition-all duration-500 ease-out group-hover:brightness-95 group-hover:scale-105"
              />
              <p className="absolute left-3 top-4 z-[2] rounded px-3 py-1.5 text-lg font-medium text-white drop-shadow sm:left-4 sm:top-5 sm:text-xl md:text-2xl">
                {room.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="container-custom border-b border-[#ccc9c1]">
        <h2 className="section-title font-heading text-3xl font-light text-[#111] mb-6 sm:text-4xl sm:mb-8 md:text-5xl md:mb-10">Explore products</h2>
        {loading ? (
          <p className="text-[#383733]">Loading...</p>
        ) : products.length > 0 ? (
          <div className="products-grid mt-4 sm:mt-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-[#383733]">No products yet. Start the backend and seed some data.</p>
        )}
      </div>
    </motion.div>
  );
}
