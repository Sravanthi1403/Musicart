const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/orderController');
const isAuthenticated = require('../middlewares/authMiddleware');

router.route('/placeOrder').post(isAuthenticated, orderControllers.placeOrder);
router.route('/myOrders').get(isAuthenticated, orderControllers.getMyOrders);

module.exports = router;