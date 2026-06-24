const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    issueType: {
      type: String,
      enum: ['Repair', 'Replacement', 'Cleaning', 'Installation', 'Other'],
      required: true,
    },
    description: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    images: [String],
    scheduledDate: Date,
    resolvedAt: Date,
    technicianNotes: String,
    adminNotes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
