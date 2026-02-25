import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/users/profile
router.get('/profile', async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @route   PATCH /api/users/profile
router.patch('/profile', async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name != null) updates.name = name;
    if (avatar != null) updates.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password').lean();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/users/favorites
router.get('/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites').select('favorites').lean();
    res.json({ success: true, data: user?.favorites || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/users/favorites/:productId
router.post('/favorites/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.favorites.includes(req.params.productId)) {
      user.favorites.push(req.params.productId);
      await user.save();
    }
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/users/favorites/:productId
router.delete('/favorites/:productId', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: req.params.productId } });
    const user = await User.findById(req.user._id).select('favorites').lean();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
