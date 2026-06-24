const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        monthlyRent: Number,
        tenureMonths: Number,
        securityDeposit: Number,
        totalRent: Number,
      },
    ],
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    deliveryDate: { type: Date, required: true },
    pickupDate: Date,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered', 'active', 'return_requested', 'returned', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'cod' },
    subtotal: Number,
    securityDepositTotal: Number,
    deliveryCharge: { type: Number, default: 0 },
    totalAmount: Number,
    notes: String,
    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
