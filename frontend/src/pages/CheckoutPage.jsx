import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStripeCheckout = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    if (!address.street?.trim() || !address.city?.trim() || !address.postalCode?.trim() || !address.country?.trim()) {
      setError('Please fill in all address fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: cart.map((i) => ({ _id: i._id || i.id, title: i.title || i.name, price: i.price, quantity: i.quantity || 1, images: i.images, img: i.img })),
          total: cartTotal,
          address,
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.message || 'Could not start checkout');
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    if (!address.street?.trim() || !address.city?.trim() || !address.postalCode?.trim() || !address.country?.trim()) {
      setError('Please fill in all address fields.');
      return;
    }
    setLoading(true);
    try {
      const items = cart.map((i) => ({
        product: i._id || i.id,
        title: i.title || i.name,
        price: i.price,
        quantity: i.quantity || 1,
        image: i.images?.[0] || i.img || '',
      }));
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items,
          total: cartTotal,
          address,
          paymentMethod: 'COD',
        }),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        navigate('/checkout/success?cod=1');
        return;
      }
      setError(data.message || 'Order failed');
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="font-heading text-2xl text-[#111]">Your cart is empty</h1>
        <Link to="/products" className="mt-4 inline-block text-[#b87f53] underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container-custom py-10 md:py-16"
    >
      <h1 className="font-heading text-3xl font-medium text-[#111] mb-8">Checkout</h1>
      {!user && (
        <p className="mb-6 text-[#383733]">
          <Link to="/login" className="text-[#b87f53] underline">Sign in</Link> to checkout.
        </p>
        )}
      <form onSubmit={paymentMethod === 'cod' ? handleCOD : handleStripeCheckout} className="max-w-xl space-y-6">
        <div>
          <h2 className="font-heading text-xl text-[#111] mb-4">Shipping address</h2>
          <input
            type="text"
            placeholder="Street address"
            value={address.street}
            onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
            className="mb-3 w-full border border-[#ccc9c1] bg-white px-3 py-2.5 focus:border-[#b87f53] focus:outline-none"
            required
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
              className="w-full border border-[#ccc9c1] bg-white px-3 py-2.5 focus:border-[#b87f53] focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Postal code"
              value={address.postalCode}
              onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
              className="w-full border border-[#ccc9c1] bg-white px-3 py-2.5 focus:border-[#b87f53] focus:outline-none"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Country"
            value={address.country}
            onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
            className="mt-3 w-full border border-[#ccc9c1] bg-white px-3 py-2.5 focus:border-[#b87f53] focus:outline-none"
            required
          />
        </div>
        <div>
          <h2 className="font-heading text-xl text-[#111] mb-3">Payment</h2>
          <label className="mb-2 flex cursor-pointer items-center gap-2">
            <input type="radio" name="pm" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
            <span>Pay with card (Stripe)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="pm" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
            <span>Cash on Delivery (COD)</span>
          </label>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded border border-[#b87f53] bg-[#b87f53] px-8 py-3 text-white hover:bg-[#a06d47] disabled:opacity-60"
          >
            {loading ? 'Processing…' : paymentMethod === 'cod' ? 'Place order (COD)' : 'Proceed to Checkout'}
          </button>
          <Link to="/cart" className="rounded border border-[#ccc9c1] bg-white px-6 py-3 text-[#111] hover:border-[#b87f53]">
            Back to cart
          </Link>
        </div>
      </form>
      <div className="mt-10 border-t border-[#ccc9c1] pt-8">
        <p className="font-heading text-lg text-[#111]">Order total</p>
        <p className="mt-1 text-xl text-[#111]">€{cartTotal.toFixed(2)}</p>
      </div>
    </motion.div>
  );
}
