import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';

export default function ProductReviewSection({
  productId,
  reviews = [],
  averageRating = 0,
  reviewCount = 0,
  onReviewSubmitted,
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to leave a review.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a rating from 1 to 5.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        setRating(0);
        setComment('');
        onReviewSubmitted?.(data.data);
      } else {
        setError(data.message || 'Could not submit review');
      }
    } catch {
      setError('Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div>
      <h2 className="font-heading text-2xl font-medium text-[#111]">Reviews</h2>
      <p className="mt-1 text-[#383733]">
        {reviewCount === 0
          ? 'No reviews yet. Be the first to review.'
          : `${averageRating.toFixed(1)} out of 5 (${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})`}
      </p>

      {user && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submitReview}
          className="mt-8 border border-[#ccc9c1] bg-white p-6"
        >
          <p className="font-heading text-lg text-[#111]">Write a review</p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-4">
            <p className="text-sm text-[#383733]">Rating</p>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl leading-none transition-transform hover:scale-110"
                >
                  <span className={star <= displayRating ? 'text-[#b87f53]' : 'text-[#ccc9c1]'}>★</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="review-comment" className="block text-sm text-[#383733]">
              Comment
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-1 w-full border border-[#ccc9c1] bg-white px-3 py-2 text-[#111] placeholder:text-[#999] focus:border-[#b87f53] focus:outline-none"
              placeholder="Share your experience with this product..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 border border-[#b87f53] bg-[#b87f53] px-6 py-2 text-white hover:bg-[#a06d47] disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit review'}
          </button>
        </motion.form>
      )}

      <ul className="mt-10 space-y-8">
        {reviews.map((r) => (
          <motion.li
            key={r._id || r.user?._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-[#eee] pb-6 last:border-0"
          >
            <div className="flex items-center gap-2">
              <div className="flex text-[#b87f53]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s}>{s <= r.rating ? '★' : '☆'}</span>
                ))}
              </div>
              {r.verifiedPurchase && (
                <span className="rounded bg-[#b87f53]/10 px-2 py-0.5 text-xs font-medium text-[#b87f53]">
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="mt-1 font-medium text-[#111]">{r.user?.name || 'Guest'}</p>
            {r.comment && <p className="mt-2 text-[#383733]">{r.comment}</p>}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
