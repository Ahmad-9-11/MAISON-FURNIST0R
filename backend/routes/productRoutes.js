import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const PAGE_SIZE = 12;

// @route   GET /api/products
// Query: page, limit, category, minPrice, maxPrice, material, search, featured, newArrival
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || PAGE_SIZE);
    const skip = (page - 1) * limit;
    const { category, minPrice, maxPrice, material, search, featured, newArrival } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (minPrice != null || maxPrice != null) {
      filter.price = {};
      if (minPrice != null) filter.price.$gte = Number(minPrice);
      if (maxPrice != null) filter.price.$lte = Number(maxPrice);
    }
    if (material) filter.material = new RegExp(material, 'i');
    if (featured === 'true') filter.isFeatured = true;
    if (newArrival === 'true') filter.isNewArrival = true;
    if (search && search.trim()) filter.$text = { $search: search.trim() };

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8).lean();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name').lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const reviewCount = product.reviews?.length || 0;
    const avgRating =
      reviewCount > 0
        ? product.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount
        : 0;
    res.json({
      success: true,
      data: {
        ...product,
        reviewCount,
        averageRating: Math.round(avgRating * 10) / 10,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    const hasPurchased = await Order.exists({
      userRef: req.user._id,
      'items.product': product._id,
      status: { $in: ['Shipped', 'Delivered'] },
    });
    const existing = product.reviews.find(
      (r) => r.user && r.user.toString() === req.user._id.toString()
    );
    if (existing) {
      existing.rating = rating;
      existing.comment = comment || '';
      existing.verifiedPurchase = !!hasPurchased;
    } else {
      product.reviews.push({
        user: req.user._id,
        rating,
        comment: comment || '',
        verifiedPurchase: !!hasPurchased,
      });
    }
    await product.save();
    const updated = await Product.findById(req.params.id)
      .populate('reviews.user', 'name')
      .lean();
    const reviewCount = updated.reviews?.length || 0;
    const avgRating =
      reviewCount > 0
        ? updated.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount
        : 0;
    res.json({
      success: true,
      data: {
        ...updated,
        reviewCount,
        averageRating: Math.round(avgRating * 10) / 10,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/products/:id/related
router.get('/:id/related', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('category').lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const related = await Product.find({
      _id: { $ne: req.params.id },
      category: product.category,
    }).limit(4).lean();
    res.json({ success: true, data: related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
