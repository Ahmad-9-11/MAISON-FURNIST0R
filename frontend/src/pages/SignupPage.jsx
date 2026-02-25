import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/verify-email', { replace: true, state: { verifyUrl: result.verifyUrl } });
    } else {
      setError(result.message || 'Registration failed');
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
          Create account
        </h1>
        <p className="mt-2 text-sm text-[#383733]">
          Join Maison for a curated experience
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <p className="text-sm text-red-600 border border-red-200 bg-red-50/50 px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="signup-name" className="block text-sm font-medium text-[#383733] mb-1">
              Name
            </label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-[#ccc9c1] bg-white px-3 py-2.5 text-[#111] placeholder:text-[#999] focus:border-[#b87f53] focus:outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-[#383733] mb-1">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#ccc9c1] bg-white px-3 py-2.5 text-[#111] placeholder:text-[#999] focus:border-[#b87f53] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-[#383733] mb-1">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-[#ccc9c1] bg-white px-3 py-2.5 text-[#111] placeholder:text-[#999] focus:border-[#b87f53] focus:outline-none"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#b87f53] bg-[#b87f53] py-3 text-white transition-colors hover:bg-[#a06d47] disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#383733]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#b87f53] underline underline-offset-2 hover:text-[#cf5600]">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
