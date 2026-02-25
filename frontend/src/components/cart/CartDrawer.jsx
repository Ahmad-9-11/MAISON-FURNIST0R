import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { cart, cartCount, cartTotal, removeFromCart, updateQuantity, cartOpen, setCartOpen } = useCart();

  const getId = (item) => item._id || item.id;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[900] bg-black/50"
            onClick={() => setCartOpen(false)}
            aria-hidden
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed right-0 top-0 z-[1000] flex h-full w-full max-w-[450px] flex-col bg-[#e9e6e3] shadow-xl"
          >
            <div className="flex h-[79px] items-center justify-between border-b border-[#f3f1ef] px-5">
              <h3 className="font-Fraunces text-[22px] font-light text-[#111]">
                Your cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </h3>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded p-1.5 text-black hover:text-[#cf5600]"
                aria-label="Close cart"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m17.5 17.5l37 37m0-37l-37 37" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {cart.length === 0 ? (
                <div className="flex h-[calc(100vh-250px)] items-center justify-center">
                  <div className="flex flex-col items-center gap-10 text-center">
                    <svg className="h-16 w-16 text-[#383733]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="m15 11l1 6m-7-6l-1 6M9 6V5a3 3 0 1 1 6 0v1" />
                      <path d="M20.224 12.526c-.586-3.121-.878-4.682-1.99-5.604C17.125 6 15.537 6 12.36 6h-.72c-3.176 0-4.764 0-5.875.922c-1.11.922-1.403 2.483-1.989 5.604c-.823 4.389-1.234 6.583-.034 8.029C4.942 22 7.174 22 11.639 22h.722c4.465 0 6.698 0 7.897-1.445c.696-.84.85-1.93.696-3.555" />
                    </svg>
                    <div className="text-base text-[#383733]">
                      <p className="mb-1 font-medium">Your cart is currently empty</p>
                      <p className="font-normal">Browse our store, find products, and happy shopping!</p>
                    </div>
                    <Link to="/products" onClick={() => setCartOpen(false)} className="rounded bg-black px-3 py-2.5 text-base text-white">
                      Browse products
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="space-y-5">
                  {cart.map((item, index) => (
                    <li
                      key={`${getId(item)}-${index}`}
                      className="relative flex items-center gap-5 border-b border-[#ddd] pb-5"
                    >
                      <button
                        type="button"
                        onClick={() => removeFromCart(getId(item))}
                        className="absolute -left-1 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800"
                        aria-label="Remove"
                      >
                        <i className="fa-solid fa-xmark text-xs" />
                      </button>
                      <img
                        src={item.images?.[0] || item.img}
                        alt={item.title || item.name}
                        className="h-20 w-20 rounded object-cover"
                      />
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="text-base font-medium capitalize text-[#111]">{item.title || item.name}</p>
                        <p className="text-sm text-[#383733]">€{(item.price || 0).toFixed(2)}</p>
                        <div className="mt-1 flex h-8 w-20 items-center justify-center gap-2 border border-[#bebcb6] bg-white">
                          <button
                            type="button"
                            className="flex h-5 w-5 items-center justify-center text-lg font-light text-[#111] hover:bg-[#111] hover:text-white"
                            onClick={() => updateQuantity(getId(item), (item.quantity || 1) - 1)}
                          >
                            −
                          </button>
                          <span className="text-sm font-medium text-black">{item.quantity || 1}</span>
                          <button
                            type="button"
                            className="flex h-5 w-5 items-center justify-center text-lg font-light text-[#111] hover:bg-[#111] hover:text-white"
                            onClick={() => updateQuantity(getId(item), (item.quantity || 1) + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-[#383733]">€{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-white p-5">
                <div className="h-1.5 w-full overflow-hidden rounded bg-[#fc6b00]">
                  <div className="h-full w-full animate-[move-lines_1s_linear_infinite] bg-[repeating-linear-gradient(-45deg,transparent,transparent_15px,#fff_16px)] bg-[length:20px_20px]" />
                </div>
                <p className="border-b border-white pb-5 pt-2 text-base font-light text-[#111] mt-2">
                  Free shipping will be applied at checkout!
                </p>
                <div className="mt-4 flex justify-between text-base text-[#111]">
                  <p>Subtotal</p>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <p className="mb-5 mt-0 text-sm font-light text-[#383733]">
                  Shipping, taxes, and discounts calculated at checkout.
                </p>
                <div className="flex w-full gap-2.5">
                  <Link
                    to="/cart"
                    onClick={() => setCartOpen(false)}
                    className="flex-1 border border-black bg-transparent py-1.5 px-3 text-center text-[#111] hover:bg-black hover:text-white"
                  >
                    View cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="flex-1 border border-white bg-black py-1.5 px-3 text-center text-white hover:bg-[#222]"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
