const express = require('express');
const router = express.Router();

// GET /product/:id - show one product detail (uses shared product data)
router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const products = req.app.locals.products || [];
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.redirect('/shop');
    }

    res.render('product-detail', { product: product, user: req.session.user || null });
});

module.exports = router;
