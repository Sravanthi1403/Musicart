const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productController');

router.route('/').get(productControllers.products);
router.route('/productSearch').get(productControllers.productSearch);
router.route('/sort').get(productControllers.sortProducts);
router.route('/filter').get(productControllers.filterProducts);

module.exports = router;