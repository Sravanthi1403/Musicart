const Order = require('../models/orderModel');
const { ErrorHandler } = require('../utils/ErrorHandler');

const placeOrder = async (req, res, next) => {
    try {
      const { username, address, paymentMethod, cartProducts, orderPrice } = req.body;
      const order = new Order({
        userId: req.user._id,
        username,
        address,
        paymentMethod,
        cartItems: cartProducts.map(product => ({
          productId: product.productId,
          quantity: product.quantity
        })),
        orderPrice
      });
      await order.save();
      res.status(201).json({ message: 'Order placed successfully!' });
    } catch (error) {
      console.error('Error placing order:', error);
      return next(new ErrorHandler(500,'Internal server error'));
    }
  };

  const getMyOrders = async (req, res, next) =>{
    try {
      const userId = req.user._id;
      console.log(userId);
      const userOrders = await Order.find({ userId }).populate({
        path: 'cartItems.productId',
        model: 'Product'
      });
      console.log(userOrders);
      if(!userOrders || userOrders.length === 0 ){
        return next(new ErrorHandler(404, 'Invoices is Empty!!'));
      }
      
      res.status(200).json({message:'Fetched user invoices successfully!', userOrders})
    } catch (error) {
      console.error('Error fetching orders:', error);
      return next(new ErrorHandler(500,'Internal server error'));
    }
  }
  
  module.exports = { placeOrder, getMyOrders };
