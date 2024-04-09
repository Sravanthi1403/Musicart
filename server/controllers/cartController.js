const Cart = require('../models/cartModel');
const { ErrorHandler } = require('../utils/ErrorHandler');

const addProductToCart = async (req, res, next) =>{
    try {
        const { productId } = req.query;
        let cartItem = await Cart.findOne({ productId });
    
        if (!cartItem) {
          cartItem = new Cart({ productId, quantity: 1 });
        } else {
          if (cartItem.quantity >= 8) {
            return next(new ErrorHandler(400,'Quantity limit exceeded'));
          }
          cartItem.quantity++;
        }

        await cartItem.save();
    
        res.status(200).json({ message: 'Product added to cart', cartItem });
      } catch (error) {
        console.error('Error adding product to cart:', error);
        return next(new ErrorHandler(500,'Internal server error'));
      }
}

const getCartProducts = async (req, res, next) =>{
  try {
    const cartItems = await Cart.find().populate("productId");
    if(!cartItems){
      return next(new ErrorHandler(404, 'Cart is Empty!!'));
    }
    res.status(200).json({message:'Fetched cart items successfully!', cartItems})
    
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return next(new ErrorHandler(500,'Internal server error'));
  }
}

const updateCartItemQuantity = async (req, res, next) => {
  try {
      const { cartItemId, newQuantity } = req.body;
      const updatedCartItem = await Cart.findByIdAndUpdate(cartItemId, { quantity: newQuantity }, { new: true });

      if (!updatedCartItem) {
          return next(new ErrorHandler(404, 'Cart item not found'));
      }

      res.status(200).json({ message: 'Quantity updated successfully', updatedCartItem });
  } catch (error) {
      console.error('Error updating quantity:', error);
      return next(new ErrorHandler(500, 'Internal server error'));
  }
};

const deleteAllItems = async (req, res, next ) => {
  try {
    await Cart.deleteMany({});
    res.status(200).json({ message: 'Cart items deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart items:', error);
    return next(new ErrorHandler(500, 'Internal server error'));
  }
}

module.exports = {addProductToCart, getCartProducts, updateCartItemQuantity, deleteAllItems };