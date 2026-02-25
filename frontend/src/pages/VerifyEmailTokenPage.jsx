import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || '';

export default function VerifyEmailTokenPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | error

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    fetch(`${API}/api/auth/verify-email/${token}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStatus('success');
        else setStatus('error');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  useEffect(() => {
    if (status === 'success') {
      try { sessionStorage.removeItem('furnistor_verify_url'); } catch (_) {}
      const t = setTimeout(() => navigate('/', { replace: true }), 2500);
      return () => clearTimeout(t);
    }
  }, [status, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-[440px] border border-[#ccc9c1] bg-white p-10 shadow-sm text-center">
        {status === 'verifying' && (
          <>
            <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-[#b87f53] border-t-transparent" />
            <h1 className="font-heading text-2xl text-[#111]">Verifying your email…</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#b87f53]/10 text-[#b87f53]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl text-[#111]">Email verified</h1>
            <p className="mt-3 text-[#383733]">Redirecting you to the homepage…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl text-[#111]">Invalid or expired link</h1>
            <p className="mt-3 text-[#383733]">This verification link is invalid or has expired.</p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="mt-6 border border-[#b87f53] bg-[#b87f53] px-6 py-2.5 text-white hover:bg-[#a06d47]"
            >
              Go to Sign in
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
