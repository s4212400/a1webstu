const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    image: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    // Reference to the user who wrote this review (1-N: one user, many reviews)
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Reference to the product this review is about (1-N: one product, many reviews)
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;