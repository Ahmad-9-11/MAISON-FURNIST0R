import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @route   POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { items, total, address, paymentMethod } = req.body;
    if (!items?.length || total == null || !address || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const order = await Order.create({
      userRef: req.user._id,
      items,
      total,
      address,
      paymentMethod,
    });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ userRef: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userRef: req.user._id }).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
