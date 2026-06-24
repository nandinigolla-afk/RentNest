// orders.js
const orderRouter = require('express').Router();
const { createOrder, getMyOrders, getOrder, updateOrderStatus, getAllOrders, requestReturn } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

orderRouter.post('/', protect, createOrder);
orderRouter.get('/my-orders', protect, getMyOrders);
orderRouter.get('/', protect, adminOnly, getAllOrders);
orderRouter.get('/:id', protect, getOrder);
orderRouter.put('/:id/status', protect, adminOnly, updateOrderStatus);
orderRouter.put('/:id/request-return', protect, requestReturn);

module.exports.orderRouter = orderRouter;

// cart.js
const cartRouter = require('express').Router();
const { getCart, addToCart, removeFromCart, updateCartItem, clearCart } = require('../controllers/cartController');

cartRouter.get('/', protect, getCart);
cartRouter.post('/add', protect, addToCart);
cartRouter.delete('/clear', protect, clearCart);
cartRouter.put('/:productId', protect, updateCartItem);
cartRouter.delete('/:productId', protect, removeFromCart);

module.exports.cartRouter = cartRouter;

// maintenance.js
const maintenanceRouter = require('express').Router();
const { createRequest, getMyRequests, getAllRequests, updateRequest } = require('../controllers/maintenanceController');

maintenanceRouter.post('/', protect, createRequest);
maintenanceRouter.get('/my-requests', protect, getMyRequests);
maintenanceRouter.get('/', protect, adminOnly, getAllRequests);
maintenanceRouter.put('/:id', protect, adminOnly, updateRequest);

module.exports.maintenanceRouter = maintenanceRouter;

// admin.js
const adminRouter = require('express').Router();
const { getDashboard, getUsers, updateUser } = require('../controllers/adminController');

adminRouter.get('/dashboard', protect, adminOnly, getDashboard);
adminRouter.get('/users', protect, adminOnly, getUsers);
adminRouter.put('/users/:id', protect, adminOnly, updateUser);

module.exports.adminRouter = adminRouter;
