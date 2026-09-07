const mongoose = require('mongoose');

// Wishlist item schema
const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    addedAt: {
        type: Date,
        default: Date.now
    },

    isPurchased: {
        type: Boolean,
        default: false
    }
}, { _id: false });

// Wishlist schema
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

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;