const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) cart = { items: [] };
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/cart/add
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, tenureMonths = 3 } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive)
      return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.tenureMonths = tenureMonths;
    } else {
      cart.items.push({ product: productId, tenureMonths });
    }
    await cart.save();
    await cart.populate('items.product');
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/cart/:productId
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product');
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/cart/:productId
exports.updateCartItem = async (req, res, next) => {
  try {
    const { tenureMonths } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });
    item.tenureMonths = tenureMonths;
    await cart.save();
    await cart.populate('items.product');
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/cart/clear
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};
