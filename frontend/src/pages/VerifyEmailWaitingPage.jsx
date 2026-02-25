import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';
const POLL_INTERVAL_MS = 5000;
const VERIFY_URL_KEY = 'furnistor_verify_url';

export default function VerifyEmailWaitingPage() {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const verifyUrlFromState = location.state?.verifyUrl;
  const [verifyUrl, setVerifyUrl] = useState(() => verifyUrlFromState || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(VERIFY_URL_KEY) : null));
  const [message, setMessage] = useState('Checking your inbox…');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (verifyUrlFromState) {
      setVerifyUrl(verifyUrlFromState);
      try { sessionStorage.setItem(VERIFY_URL_KEY, verifyUrlFromState); } catch (_) {}
    }
  }, [verifyUrlFromState]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user.isEmailVerified) {
      navigate('/', { replace: true });
      return;
    }

    const check = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
        const data = await res.json();
        if (data.success && data.user?.isEmailVerified) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setMessage('Email verified! Redirecting…');
          fetchUser();
          setTimeout(() => navigate('/', { replace: true }), 800);
        }
      } catch {
        setMessage('Something went wrong. Please try again.');
      }
    };

    intervalRef.current = setInterval(check, POLL_INTERVAL_MS);
    check();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user, navigate, fetchUser]);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-[440px] border border-[#ccc9c1] bg-white p-10 shadow-sm text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#b87f53] text-[#b87f53]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-medium text-[#111]">
          Waiting for verification
        </h1>
        <p className="mt-3 text-[#383733]">
          We've sent a verification link to <strong className="text-[#111]">{user.email}</strong>.
          Click the link in that email to verify your account.
        </p>
        <p className="mt-4 text-sm text-[#383733]">
          {message}
        </p>
        {verifyUrl && (
          <p className="mt-6 text-sm text-[#383733]">
            Didn&apos;t get the email? Use this link:{' '}
            <a href={verifyUrl} className="block mt-2 break-all text-[#b87f53] underline hover:text-[#cf5600] font-medium">
              Verify my email
            </a>
          </p>
        )}
        <p className="mt-4 text-sm text-[#383733]">
          You can <Link to="/" className="text-[#b87f53] underline hover:text-[#cf5600]">browse the store</Link> or go to <Link to="/login" className="text-[#b87f53] underline hover:text-[#cf5600]">Sign in</Link>.
        </p>
        <p className="mt-4 text-xs text-[#888]">
          You can close this tab and return after verifying. We&apos;ll check every 5 seconds if you stay here.
        </p>
      </div>
    </motion.div>
  );
}
