const express = require('express');
const Product = require('../models/product');

const router = express.Router();


// ============================================================
// VALIDATION
// ============================================================

function validateProduct(product) {
    if (!product) {
        return false;
    }

    if (!product.productId || !product.name) {
        return false;
    }

    if (!product.category) {
        return false;
    }

    if (!product.platform) {
        return false;
    }

    if (typeof product.price !== 'number' || product.price < 0) {
        return false;
    }

    if (typeof product.stock !== 'number' || product.stock < 0) {
        return false;
    }

    if (
        product.condition !== 'new' &&
        product.condition !== 'used'
    ) {
        return false;
    }

    if (
        typeof product.rating !== 'number' ||
        product.rating < 0 ||
        product.rating > 5
    ) {
        return false;
    }

    return true;
}


// ============================================================
// SHOP ROUTE
// ============================================================

router.get('/', async (req, res) => {

    try {

        // ========================================================
        // CART / WISHLIST COUNTS
        // ========================================================

        const wishlist = req.app.locals.wishlist || [];
        const cart = req.app.locals.cart || [];

        const wishlistCount = wishlist.reduce(
            (total, item) => total + (item.wishlistClicks || 1),
            0
        );

        const cartCount = cart.reduce(
            (total, item) => total + (item.quantity || 0),
            0
        );


        // ========================================================
        // FILTER VALUES
        // ========================================================

        const search = String(
            req.query.search || ''
        ).trim().toLowerCase();


        const categories = Array.isArray(req.query.category)
            ? req.query.category
            : req.query.category
                ? [req.query.category]
                : [];


        const platforms = Array.isArray(req.query.platform)
            ? req.query.platform
            : req.query.platform
                ? [req.query.platform]
                : [];


        const condition = req.query.condition || 'all';


        const minPrice =
            req.query['min-price'] !== undefined &&
            req.query['min-price'] !== ''
                ? Number(req.query['min-price'])
                : 0;


        const maxPrice =
            req.query['max-price'] !== undefined &&
            req.query['max-price'] !== ''
                ? Number(req.query['max-price'])
                : Infinity;


        const stockOptions = Array.isArray(req.query.stock)
            ? req.query.stock
            : req.query.stock
                ? [req.query.stock]
                : [];


        const sort = req.query.sort || 'title-asc';


        // ========================================================
        // GET PRODUCTS FROM MONGODB
        // ========================================================

        const dbProducts = await Product.find({})
            .lean();


        // ========================================================
        // CONVERT MONGODB PRODUCTS TO SHOP FORMAT
        // ========================================================

        const products = dbProducts
            .filter(validateProduct)
            .map(product => ({
                id: product.productId,
                name: product.name,
                category: product.category,
                platform: product.platform,
                image: product.image,
                oldPrice: product.oldPrice,
                price: product.price,
                discount: product.discount,
                condition: product.condition,
                rating: product.rating,
                ratingCount: product.ratingCount,
                stock: product.stock
            }));


        // ========================================================
        // FILTER PRODUCTS
        // ========================================================

        let filteredProducts = products.filter(product => {

            // ----------------------------------------------------
            // Search
            // ----------------------------------------------------

            const productName = String(
                product.name || ''
            ).toLowerCase();

            if (
                search &&
                !productName.includes(search)
            ) {
                return false;
            }


            // ----------------------------------------------------
            // Category
            // ----------------------------------------------------

            if (
                categories.length > 0 &&
                !categories.includes(product.category)
            ) {
                return false;
            }


            // ----------------------------------------------------
            // Platform
            // ----------------------------------------------------

            if (platforms.length > 0) {

                const productPlatform =
                    String(product.platform || '').toLowerCase();

                const platformMatch = platforms.some(platform => {

                    const selectedPlatform =
                        String(platform).toLowerCase();

                    if (selectedPlatform === 'ps5') {
                        return (
                            productPlatform.includes('ps5') ||
                            productPlatform.includes('playstation')
                        );
                    }

                    if (selectedPlatform === 'xbox') {
                        return productPlatform.includes('xbox');
                    }

                    if (selectedPlatform === 'switch') {
                        return productPlatform.includes('switch');
                    }

                    return productPlatform === selectedPlatform;
                });

                if (!platformMatch) {
                    return false;
                }
            }


            // ----------------------------------------------------
            // Condition
            // ----------------------------------------------------

            const productCondition =
                product.condition || 'new';

            if (
                condition !== 'all' &&
                productCondition !== condition
            ) {
                return false;
            }


            // ----------------------------------------------------
            // Price
            // ----------------------------------------------------

            const price = Number(product.price) || 0;

            if (
                price < minPrice ||
                price > maxPrice
            ) {
                return false;
            }


            // ----------------------------------------------------
            // Stock
            // ----------------------------------------------------

            if (stockOptions.length > 0) {

                const stock =
                    Number(product.stock) || 0;

                let stockMatch = false;


                // In stock
                if (
                    stockOptions.includes('in') &&
                    stock > 0
                ) {
                    stockMatch = true;
                }


                // Low stock: 1–6
                if (
                    stockOptions.includes('low') &&
                    stock > 0 &&
                    stock <= 6
                ) {
                    stockMatch = true;
                }


                if (!stockMatch) {
                    return false;
                }
            }


            return true;
        });


        // ========================================================
        // SORT PRODUCTS
        // ========================================================

        filteredProducts.sort((a, b) => {

            switch (sort) {

                case 'title-asc':
                    return String(a.name || '')
                        .localeCompare(
                            String(b.name || '')
                        );


                case 'title-desc':
                    return String(b.name || '')
                        .localeCompare(
                            String(a.name || '')
                        );


                case 'price-asc':
                    return (
                        Number(a.price) -
                        Number(b.price)
                    );


                case 'price-desc':
                    return (
                        Number(b.price) -
                        Number(a.price)
                    );


                case 'qty-desc':
                    return (
                        Number(b.stock) -
                        Number(a.stock)
                    );


                case 'qty-asc':
                    return (
                        Number(a.stock) -
                        Number(b.stock)
                    );


                default:
                    return String(a.name || '')
                        .localeCompare(
                            String(b.name || '')
                        );
            }
        });


        // ========================================================
        // RENDER SHOP
        // ========================================================

        res.render('shop', {
            products: filteredProducts,
            wishlistCount: wishlistCount,
            cartCount: cartCount,
            user: req.session.user || null,
            query: req.query
        });

    } catch (error) {

        console.error(
            'Error loading shop:',
            error.message
        );

        res.status(500).send(
            'Unable to load products.'
        );
    }

});


// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;