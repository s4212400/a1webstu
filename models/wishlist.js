const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    productNumber: {
        type: Number,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    platform: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    oldPrice: {
        type: Number,
        min: 0
    },

    discount: {
        type: Number,
        min: 0,
        max: 100
    },

    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

    ratingCount: {
        type: Number,
        min: 0,
        default: 0
    },

    stock: {
        type: Number,
        min: 0,
        required: true
    },

    wishlistClicks: {
        type: Number,
        default: 1,
        min: 1
    },

    addedToCart: {
        type: Number,
        default: 0,
        min: 0
    },

    purchasedCount: {
        type: Number,
        default: 0,
        min: 0
    },

    isPurchased: {
        type: Boolean,
        default: false
    },

    addedDate: {
        type: Date,
        default: Date.now
    }
}, {
    _id: true
});


const wishlistSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    items: {
        type: [wishlistItemSchema],
        default: []
    }

}, {
    timestamps: true
});


const Wishlist =
    mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;