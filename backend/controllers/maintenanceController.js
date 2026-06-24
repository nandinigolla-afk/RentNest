const Maintenance = require('../models/Maintenance');
const Order = require('../models/Order');

// @route POST /api/maintenance
exports.createRequest = async (req, res, next) => {
  try {
    const { orderId, productId, issueType, description, priority } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const request = await Maintenance.create({
      user: req.user.id,
      order: orderId,
      product: productId,
      issueType,
      description,
      priority,
    });
    res.status(201).json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/maintenance/my-requests
exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await Maintenance.find({ user: req.user.id })
      .populate('product', 'name images')
      .populate('order', 'status deliveryAddress')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/maintenance (admin)
exports.getAllRequests = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    const requests = await Maintenance.find(filter)
      .populate('user', 'name email phone')
      .populate('product', 'name images')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/maintenance/:id (admin)
exports.updateRequest = async (req, res, next) => {
  try {
    const { status, scheduledDate, technicianNotes, adminNotes } = req.body;
    const request = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status, scheduledDate, technicianNotes, adminNotes, ...(status === 'resolved' && { resolvedAt: Date.now() }) },
      { new: true }
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: request });
  } catch (err) {
    next(err);
  }
};
