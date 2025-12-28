const Order = require('../models/orderModel');
const { ErrorHandler } = require('../utils/ErrorHandler');

// const placeOrder = async (req, res, next) => {
//     try {
//       const { username, address, paymentMethod, cartProducts, orderPrice } = req.body;
//       const order = new Order({
//         userId: req.user._id,
//         username,
//         address,
//         paymentMethod,
//         cartItems: cartProducts.map(product => ({
//           productId: product.productId,
//           quantity: product.quantity
//         })),
//         orderPrice
//       });
//       await order.save();
//       res.status(201).json({ message: 'Order placed successfully!' });
//     } catch (error) {
//       console.error('Error placing order:', error);
//       return next(new ErrorHandler(500,'Internal server error'));
//     }
//   };


  const placeOrder = async (req, res, next) => {
  try {
    console.log("====== PLACE ORDER HIT ======");
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    const { address, paymentMethod, cartProducts, orderPrice } = req.body;

    console.log("address:", address);
    console.log("paymentMethod:", paymentMethod);
    console.log("cartProducts:", cartProducts);
    console.log("orderPrice:", orderPrice);

    if (!req.user) {
      console.log("❌ req.user missing");
    }

    if (!cartProducts || !Array.isArray(cartProducts)) {
      console.log("❌ cartProducts invalid");
    }

    const mappedItems = cartProducts.map((product, index) => {
      console.log(`--- cart item ${index} ---`);
      console.log("product:", product);
      console.log("product.productId:", product.productId);

      return {
        productId: product.productId?._id || product.productId,
        quantity: product.quantity
      };
    });

    console.log("mappedItems:", mappedItems);

    const order = new Order({
      userId: req.user._id,
      username: req.user.username,
      address,
      paymentMethod,
      cartItems: mappedItems,
      orderPrice
    });

    console.log("ORDER BEFORE SAVE:", order);

    await order.save();

    console.log("✅ ORDER SAVED SUCCESSFULLY");

    res.status(201).json({ message: "Order placed successfully!" });

  } catch (error) {
    console.error("🔥 PLACE ORDER ERROR:", error);
    return next(new ErrorHandler(500, "Internal server error"));
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
