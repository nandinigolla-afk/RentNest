const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @route POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, deliveryDate, notes } = req.body;

    let subtotal = 0;
    let securityDepositTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      if (product.availableQuantity < 1)
        return res.status(400).json({ success: false, message: `${product.name} not available` });

      const totalRent = product.monthlyRent * item.tenureMonths;
      subtotal += totalRent;
      securityDepositTotal += product.securityDeposit;
      orderItems.push({
        product: product._id,
        monthlyRent: product.monthlyRent,
        tenureMonths: item.tenureMonths,
        securityDeposit: product.securityDeposit,
        totalRent,
      });

      product.availableQuantity -= 1;
      await product.save();
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      deliveryAddress,
      deliveryDate,
      notes,
      subtotal,
      securityDepositTotal,
      deliveryCharge: 0,
      totalAmount: subtotal + securityDepositTotal,
      statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });

    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    await order.populate('items.product', 'name images category');
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images category monthlyRent')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images category brand');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/orders/:id/status (admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = status;
    order.statusHistory.push({ status, note });
    if (status === 'returned') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { availableQuantity: 1 } });
      }
    }
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/orders (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .populate('items.product', 'name category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, data: orders, pagination: { total, page: Number(page) } });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/orders/:id/request-return
exports.requestReturn = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.status !== 'active' && order.status !== 'delivered')
      return res.status(400).json({ success: false, message: 'Order not eligible for return' });
    order.status = 'return_requested';
    order.statusHistory.push({ status: 'return_requested', note: 'User requested return' });
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
