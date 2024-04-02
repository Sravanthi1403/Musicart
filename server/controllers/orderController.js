const Order = require('../models/orderModel');
const { ErrorHandler } = require('../utils/ErrorHandler');

const placeOrder = async (req, res, next) => {
    try {
      const { username, address, paymentMethod, cartProducts, orderPrice } = req.body;
      const order = new Order({
        username,
        address:address.current,
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

  const getAllOrders = async (req, res, next) =>{
    try {
      const allOrders = await Order.find().populate({
        path: 'cartItems.productId',
        model: 'Product'
      });
      if(!allOrders){
        return next(new ErrorHandler(404, 'Invoices is Empty!!'));
      }
      // console.log('orders data',allOrders)
      res.status(200).json({message:'Fetched all orders successfully!', allOrders})
    } catch (error) {
      console.error('Error fetching orders:', error);
      return next(new ErrorHandler(500,'Internal server error'));
    }
  }
  
  module.exports = { placeOrder, getAllOrders };
