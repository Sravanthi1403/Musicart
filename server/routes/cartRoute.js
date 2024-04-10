const express = require('express');
const router = express.Router();
const cartControllers = require('../controllers/cartController');
const isAuthenticated = require('../middlewares/authMiddleware');


router.route('/addProductToCart').post(cartControllers.addProductToCart);
router.route('/getCartProducts').get(isAuthenticated, cartControllers.getCartProducts);
router.route('/updateQuantity').put(cartControllers.updateCartItemQuantity);
router.route('/deleteAllItems').delete(cartControllers.deleteAllItems);


module.exports = router;