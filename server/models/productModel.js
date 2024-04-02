const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    stars: Number,
    reviewsno: Number,
    price: String,
    color: String,
    category: String,
    about: [String],
    available: String,
    brand: String,
    carousel_images: [String]
})

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;