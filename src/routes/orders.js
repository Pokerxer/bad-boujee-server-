const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const { createOrder, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/my-orders', auth, getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;
