const express = require('express');
const router = express.Router();
const orderControllers = require('../controllers/orderController');

router.route('/placeOrder').post(orderControllers.placeOrder);
router.route('/getAllOrders').get(orderControllers.getAllOrders);

module.exports = router;