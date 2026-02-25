import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const [wishFilled, setWishFilled] = useState(false);
  const { addToCart, openCart } = useCart();

  const id = product._id || product.id;
  const title = product.title || product.name;
  const price = product.price ?? 0;
  const img = product.images?.[0] || product.img;
  const imgHover = product.images?.[1] || product.imgHover || img;
  const tag = product.isNewArrival ? 'New' : product.isFeatured ? 'Featured' : product.tag || null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      _id: id,
      id,
      title,
      name: title,
      price,
      images: product.images || [img],
      img,
    }, 1);
    openCart?.();
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col"
    >
      <Link to={`/products/${id}`} className="flex flex-col flex-1">
        <div className="relative w-full overflow-hidden bg-[#f3f1ef] aspect-[4/5] min-h-[280px] sm:min-h-[320px]">
          <img
            src={img}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-300 group-hover:opacity-0"
          />
          {imgHover && imgHover !== img && (
            <img
              src={imgHover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
          {tag && (
            <div className="product-tag absolute left-4 top-4 z-10 rounded border border-[#fc6b00] bg-white px-2 py-1 text-xs font-medium uppercase text-[#fc6b00]">
              {tag}
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-1 flex-col px-1">
          <h3 className="name mb-1 flex items-center justify-between gap-2 text-base font-medium text-[#111] sm:text-lg">
            <span className="line-clamp-2">{title}</span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.preventDefault(); setWishFilled(!wishFilled); }}
              onKeyDown={(e) => e.key === 'Enter' && setWishFilled(!wishFilled)}
              className="shrink-0 cursor-pointer opacity-0 transition-all duration-300 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
              aria-label={wishFilled ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className={wishFilled ? 'fill-[#54595f] stroke-[#54595f]' : 'fill-none stroke-current'}
                strokeWidth="1.5"
                strokeLinejoin="round"
              >
                <path d="M4.087 6.477a4.565 4.565 0 0 1 6.456 0L12 7.934l1.457-1.457a4.565 4.565 0 0 1 6.456 6.457l-1.457 1.456.013.013-6.456 6.457-.013-.013-.013.013-6.456-6.457.013-.013-1.457-1.456a4.565 4.565 0 0 1 0-6.457Z" />
              </svg>
            </span>
          </h3>
          <p className="price text-sm text-[#383733] transition-all duration-300 group-hover:opacity-0 group-hover:invisible sm:text-base">
            €{price.toFixed(2)}
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            className="add-to-cart mt-1 hidden items-center gap-1 border-none bg-transparent p-0 text-base text-[#383733] hover:text-[#b87f53] cursor-pointer group-hover:flex"
          >
            <svg className="plus hidden h-4 w-5 group-hover:inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
              <path fill="currentColor" fillRule="evenodd" d="M8 2.75a.5.5 0 0 0-1 0V7H2.75a.5.5 0 0 0 0 1H7v4.25a.5.5 0 0 0 1 0V8h4.25a.5.5 0 0 0 0-1H8V2.75Z" clipRule="evenodd" />
            </svg>
            Add to cart
          </button>
        </div>
      </Link>
    </motion.article>
  );
}
