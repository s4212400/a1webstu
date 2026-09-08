const mongoose = require('mongoose');

// Product schema - stores product information for the shop
const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true,
        enum: ['console', 'game', 'accessory']
    },

    platform: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    oldPrice: {
        type: Number,
        min: 0
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    discount: {
        type: Number,
        min: 0,
        max: 100
    },

    condition: {
        type: String,
        required: true,
        enum: ['new', 'used']
    },

    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },

    ratingCount: {
        type: Number,
        default: 0,
        min: 0
    },

    stock: {
        type: Number,
        required: true,
        min: 0
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;