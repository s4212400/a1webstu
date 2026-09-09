const express = require('express');
const Product = require('../models/product');
const Review = require('../models/reviews');

const router = express.Router();

// GET /product/:id - show product detail + its reviews
router.get('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await Product.findOne({ productId: productId });

        if (!product) {
            return res.redirect('/shop');
        }

        // Load reviews for THIS product, newest first
        const reviews = await Review.find({ product: product._id })
            .populate('author')
            .sort({ date: -1 });

        res.render('product-detail', {
            product: product,
            reviews: reviews,
            user: req.session.user || null
        });

    } catch (error) {
        console.error('Error loading product:', error.message);
        res.redirect('/shop');
    }
});

module.exports = router;