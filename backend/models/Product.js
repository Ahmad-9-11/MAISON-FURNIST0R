import mongoose from 'mongoose';

const dimensionSchema = new mongoose.Schema({
  length: { type: Number, default: null },
  width: { type: Number, default: null },
  height: { type: Number, default: null },
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  verifiedPurchase: { type: Boolean, default: false },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  brand: { type: String, trim: true, default: '' },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: ['Sofas', 'Tables', 'Lighting', 'Chairs', 'Beds', 'Textiles', 'Outdoor', 'Home Decor'],
  },
  material: { type: String, trim: true, default: '' },
  dimensions: { type: dimensionSchema, default: () => ({}) },
  stock: { type: Number, required: true, default: 0, min: 0 },
  images: [{ type: String }],
  colors: [{ name: { type: String }, hex: { type: String } }],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  reviews: [reviewSchema],
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1, isNewArrival: 1 });

export default mongoose.model('Product', productSchema);
