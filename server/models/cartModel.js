const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default: 0,
        required: true,
        max : 8
    }
});
const Cart = new mongoose.model("Cart", cartSchema);
module.exports = Cart