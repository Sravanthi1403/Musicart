const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["PayOnDelivery", "UPI", "Card"],
      default: "PayOnDelivery",
      required: true
    },
    cartItems: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
    orderPrice: {
      type: Number,
      required: true
    }
  });

const Order = new mongoose.model("Order", orderSchema)

module.exports = Order;