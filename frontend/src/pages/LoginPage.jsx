import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-[420px] border border-[#ccc9c1] bg-white p-10 shadow-sm">
        <h1 className="font-heading text-3xl font-medium text-[#111] tracking-wide">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-[#383733]">
          Welcome back to Maison
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <p className="text-sm text-red-600 border border-red-200 bg-red-50/50 px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-[#383733] mb-1">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#ccc9c1] bg-white px-3 py-2.5 text-[#111] placeholder:text-[#999] focus:border-[#b87f53] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-[#383733] mb-1">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#ccc9c1] bg-white px-3 py-2.5 text-[#111] placeholder:text-[#999] focus:border-[#b87f53] focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#b87f53] bg-[#b87f53] py-3 text-white transition-colors hover:bg-[#a06d47] disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#383733]">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-[#b87f53] underline underline-offset-2 hover:text-[#cf5600]">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
