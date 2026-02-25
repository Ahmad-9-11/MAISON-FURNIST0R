import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isCOD = searchParams.get('cod') === '1';
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isCOD) {
      clearCart();
      setDone(true);
      return;
    }
    if (!sessionId || !user) {
      setDone(true);
      return;
    }
    fetch(`${API}/api/stripe/order-from-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) clearCart();
        setDone(true);
        if (!data.success) setError(data.message || 'Could not create order');
      })
      .catch(() => {
        setDone(true);
        setError('Something went wrong');
      });
  }, [sessionId, user, isCOD, clearCart]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container-custom flex min-h-[50vh] flex-col items-center justify-center py-16 text-center"
    >
      {!done && <p className="text-[#383733]">Confirming your order…</p>}
      {done && (
        <>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#b87f53]/20 text-[#b87f53]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-heading text-3xl font-medium text-[#111]">Thank you for your order</h1>
              <p className="mt-2 text-[#383733]">Your order has been placed successfully.</p>
            </>
          )}
          <Link to="/" className="mt-8 inline-block rounded border border-[#b87f53] bg-[#b87f53] px-6 py-3 text-white hover:bg-[#a06d47]">
            Continue shopping
          </Link>
        </>
      )}
    </motion.div>
  );
}
