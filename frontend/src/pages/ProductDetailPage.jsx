import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/products/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductReviewSection from '../components/products/ProductReviewSection';

const API = import.meta.env.VITE_API_URL || '';
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[#ccc9c1]">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-heading text-base text-[#111]">{title}</span>
        <svg
          className={`h-4 w-4 text-[#b87f53] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-[#555]" style={{ fontFamily: 'system-ui, sans-serif' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [zoom, setZoom] = useState(false);
  const { addToCart, openCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/products/${id}`).then((r) => r.json()),
      fetch(`${API}/api/products/${id}/related`).then((r) => r.json()),
    ])
      .then(([prodRes, relRes]) => {
        if (prodRes.success) setProduct(prodRes.data);
        else setProduct(null);
        if (relRes.success) setRelated(relRes.data || []);
        else setRelated([]);
      })
      .catch(() => {
        setProduct(null);
        setRelated([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const refreshProduct = () => {
    fetch(`${API}/api/products/${id}`)
      .then((r) => r.json())
      .then((res) => res.success && setProduct(res.data));
  };

  if (loading) {
    return (
      <div className="container-custom flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b87f53] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="font-heading text-2xl text-[#111]">Product not found</h1>
        <Link to="/products" className="mt-4 inline-block text-[#b87f53] underline">Back to products</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : (product.img ? [product.img] : []);
  const mainImage = images[selectedImageIndex] || images[0];
  const colors = product.colors?.length ? product.colors : [{ name: 'Default', hex: '#e9e6e3' }];
  const dim = product.dimensions || {};
  const hasDimensions = dim && (dim.length != null || dim.width != null || dim.height != null);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        _id: product._id,
        id: product._id,
        title: product.title,
        name: product.title,
        price: product.price,
        images: product.images || images,
        img: mainImage,
      }, 1);
    }
    openCart?.();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
        text: product.description?.slice(0, 100),
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container-custom pb-20 pt-8"
    >
      {/* Breadcrumb */}
      <motion.nav variants={item} className="mb-6 flex items-center gap-2 text-xs text-[#aaa]" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Link to="/" className="hover:text-[#b87f53] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#b87f53] transition-colors">Collections</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#b87f53] transition-colors">{product.category}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#333]">{product.title}</span>
      </motion.nav>

      {/* Rating summary at top */}
      {(product.reviewCount > 0 || product.averageRating > 0) && (
        <motion.div variants={item} className="mb-6 flex items-center gap-3 text-sm text-[#383733]">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= Math.round(product.averageRating) ? 'text-[#b87f53]' : 'text-[#ccc9c1]'}>
                ★
              </span>
            ))}
          </div>
          <span>{product.averageRating?.toFixed(1)}</span>
          <span>({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        {/* Left: Image gallery */}
        <motion.div variants={item} className="relative lg:col-span-3">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden bg-[#f3f1ef]"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <motion.img
              src={mainImage}
              alt={product.title}
              className="h-full w-full object-cover"
              animate={{ scale: zoom ? 1.08 : 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden border-2 object-cover transition-colors ${
                    selectedImageIndex === idx ? 'border-[#b87f53]' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Info */}
        <div className="flex flex-col lg:col-span-2">
          <motion.h1 variants={item} className="font-heading text-3xl font-medium text-[#111] md:text-4xl">
            {product.title}
          </motion.h1>
          {product.brand && (
            <motion.p variants={item} className="mt-1 text-sm uppercase tracking-wider text-[#383733]">
              {product.brand}
            </motion.p>
          )}
          <motion.p variants={item} className="mt-4 text-2xl text-[#111]">
            €{product.price?.toFixed(2)}
          </motion.p>
          {product.description && (
            <motion.div variants={item} className="mt-6 border-t border-[#ccc9c1] pt-6">
              <p className="font-heading text-lg text-[#111]">Description</p>
              <p className="mt-2 whitespace-pre-line text-[#383733] leading-relaxed">
                {product.description}
              </p>
            </motion.div>
          )}

          {/* Material & Dimensions */}
          <motion.div variants={item} className="mt-6 border-t border-[#ccc9c1] pt-6">
            <p className="font-heading text-lg text-[#111]">Details</p>
            <dl className="mt-2 space-y-1 text-[#383733]">
              {product.material && (
                <div>
                  <dt className="inline font-medium">Material: </dt>
                  <dd className="inline">{product.material}</dd>
                </div>
              )}
              {hasDimensions && (
                <div>
                  <dt className="inline font-medium">Dimensions: </dt>
                  <dd className="inline">
                    {[dim.length, dim.width, dim.height].filter(Boolean).join(' × ')} cm
                  </dd>
                </div>
              )}
            </dl>
          </motion.div>

          {/* Accordions: Care & Shipping */}
          <motion.div variants={item} className="mt-6">
            <Accordion title="Product Care">
              <p>Clean with a soft, dry cloth. Avoid abrasive cleaners or harsh chemicals. For upholstered pieces, spot-clean with a damp cloth and mild detergent. Keep out of direct sunlight to preserve colour.</p>
            </Accordion>
            <Accordion title="Shipping & Delivery">
              <ul className="space-y-1.5">
                <li>🚚 Standard delivery: 5–10 business days</li>
                <li>📦 White-glove delivery available at checkout for large items</li>
                <li>🌍 We ship Europe-wide. International shipping calculated at checkout.</li>
                <li>↩ 30-day returns on unused items in original packaging.</li>
              </ul>
            </Accordion>
          </motion.div>

          {/* Color swatches */}
          {colors.length > 0 && (
            <motion.div variants={item} className="mt-4 border-t border-[#ccc9c1] pt-5">
              <p className="font-heading text-base text-[#111]">Colour</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    title={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      selectedColor?.name === c.name ? 'border-[#b87f53]' : 'border-[#ccc9c1]'
                    }`}
                    style={{ backgroundColor: c.hex || '#e9e6e3' }}
                  />
                ))}
              </div>
              {selectedColor && (
                <p className="mt-2 text-xs text-[#383733]" style={{ fontFamily: 'system-ui, sans-serif' }}>Selected: {selectedColor.name}</p>
              )}
            </motion.div>
          )}

          {/* Quantity */}
          <motion.div variants={item} className="mt-6 border-t border-[#ccc9c1] pt-6">
            <p className="font-heading text-lg text-[#111]">Quantity</p>
            <div className="mt-2 flex h-11 w-28 items-center justify-between border border-[#bebcb6] bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-full w-10 items-center justify-center text-[#111] hover:bg-[#111] hover:text-white"
              >
                −
              </button>
              <span className="text-sm font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-full w-10 items-center justify-center text-[#111] hover:bg-[#111] hover:text-white"
              >
                +
              </button>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleAddToCart}
              className="group relative overflow-hidden border border-[#b87f53] bg-white px-10 py-3.5 text-sm font-medium uppercase tracking-widest text-[#b87f53] transition-colors duration-300 hover:text-white"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              <span className="absolute inset-0 -translate-x-full bg-[#b87f53] transition-transform duration-300 ease-out group-hover:translate-x-0" />
              <span className="relative">Add to Cart</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="border border-[#ccc9c1] bg-white px-6 py-3 text-[#111] hover:border-[#b87f53] hover:text-[#b87f53]"
            >
              Share
            </button>
            {user && (
              <Link
                to="/wishlist"
                className="flex items-center gap-2 border border-[#ccc9c1] bg-white px-6 py-3 text-[#111] hover:border-[#b87f53] hover:text-[#b87f53]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinejoin="round" d="M4.087 6.477a4.565 4.565 0 0 1 6.456 0L12 7.934l1.457-1.457a4.565 4.565 0 0 1 6.456 6.457l-1.457 1.456.013.013-6.456 6.457-.013-.013-.013.013-6.456-6.457.013-.013-1.457-1.456a4.565 4.565 0 0 1 0-6.457Z" />
                </svg>
                Wishlist
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Reviews */}
      <motion.div variants={item} className="mt-16 border-t border-[#ccc9c1] pt-16">
        <ProductReviewSection
          productId={product._id}
          reviews={product.reviews || []}
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
          onReviewSubmitted={refreshProduct}
        />
      </motion.div>

      {/* Related */}
      {related.length > 0 && (
        <motion.section variants={item} className="mt-16 md:mt-20">
          <h2 className="font-heading text-2xl font-medium text-[#111] md:text-3xl">Related products</h2>
          <div className="products-grid mt-6 md:mt-8">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
