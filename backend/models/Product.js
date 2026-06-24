const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Furniture', 'Appliances', 'Electronics'],
    },
    subcategory: {
      type: String,
      enum: ['Bed', 'Sofa', 'Table', 'Chair', 'Wardrobe', 'Refrigerator', 'Washing Machine', 'TV', 'AC', 'Microwave', 'Other'],
    },
    images: [{ type: String }],
    monthlyRent: { type: Number, required: true, min: 0 },
    securityDeposit: { type: Number, required: true, min: 0 },
    tenureOptions: [
      {
        months: { type: Number, required: true },
        discountPercent: { type: Number, default: 0 },
      },
    ],
    brand: { type: String },
    condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair'], default: 'Good' },
    availableQuantity: { type: Number, default: 1, min: 0 },
    totalQuantity: { type: Number, default: 1 },
    features: [String],
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: 'cm' },
    },
    weight: Number,
    color: String,
    serviceAreas: [String],
    isActive: { type: Boolean, default: true },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
