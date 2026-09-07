const express = require('express');
const Product = require('../models/product');

const router = express.Router();


// GET /product/:id - show one product detail
router.get('/:id', async (req, res) => {
    try {

        const productId = parseInt(req.params.id);

        const product = await Product.findOne({
            productId: productId
        });

        if (!product) {
            return res.redirect('/shop');
        }

        res.render('product-detail', {
            product: product,
            user: req.session.user || null
        });

    } catch (error) {

        console.error(
            'Error loading product:',
            error.message
        );

        res.redirect('/shop');
    }
});


module.exports = router;