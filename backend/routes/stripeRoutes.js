import express from 'express';
import Stripe from 'stripe';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// @route   POST /api/stripe/create-checkout-session
router.post('/create-checkout-session', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ success: false, message: 'Stripe is not configured' });
  }
  try {
    const { items, total, address, success_url, cancel_url } = req.body;
    if (!items?.length || total == null || !address?.street || !address?.city || !address?.postalCode || !address?.country) {
      return res.status(400).json({ success: false, message: 'Missing items, total, or address' });
    }
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title || item.name,
          images: item.images?.length ? item.images.slice(0, 1) : item.img ? [item.img] : [],
        },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: success_url || `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${FRONTEND_URL}/checkout`,
      client_reference_id: String(req.user._id),
      metadata: {
        userRef: String(req.user._id),
        address: JSON.stringify(address),
        total: String(total),
        items: JSON.stringify(items.map((i) => ({
          product: i._id || i.id,
          title: i.title || i.name,
          price: i.price,
          quantity: i.quantity || 1,
          image: i.images?.[0] || i.img || '',
        }))),
      },
    });
    res.json({ success: true, url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Stripe error' });
  }
});

// @route   POST /api/stripe/order-from-session — create order after successful Stripe payment
router.post('/order-from-session', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ success: false, message: 'Stripe is not configured' });
  }
  try {
    const { session_id } = req.body;
    if (!session_id) return res.status(400).json({ success: false, message: 'session_id required' });
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid' || session.client_reference_id !== String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Invalid or unpaid session' });
    }
    const address = JSON.parse(session.metadata?.address || '{}');
    const total = parseFloat(session.metadata?.total || session.amount_total / 100) || 0;
    const items = JSON.parse(session.metadata?.items || '[]');
    if (!items.length) {
      return res.status(400).json({ success: false, message: 'No items in session' });
    }
    const order = await Order.create({
      userRef: req.user._id,
      items: items.map((i) => ({ product: i.product, title: i.title, price: i.price, quantity: i.quantity, image: i.image })),
      total,
      status: 'Pending',
      address,
      paymentMethod: 'Stripe',
      stripePaymentIntentId: session.payment_intent || session.id,
    });
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('Order from session error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Failed to create order' });
  }
});

export default router;
