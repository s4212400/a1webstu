const express = require('express');

const router = express.Router();


// Wishlist data
let wishlist = [];


// Make wishlist available to server.js and other routes
router.use((req, res, next) => {
    req.app.locals.wishlist = wishlist;
    next();
});


// Show Wishlist
router.get('/', (req, res) => {

    const wishlistCount = wishlist.reduce(
        (total, item) => total + (item.wishlistClicks || 1),
        0
    );

    const cart = req.app.locals.cart || [];

    const cartCount = cart.reduce(
        (total, item) => total + (item.quantity || 0),
        0
    );

    res.render('wishlist', {
        wishlist: wishlist,
        wishlistCount: wishlistCount,
        cartCount: cartCount,
        user: req.session.user || null
    });

});


// Add product to Wishlist
router.post('/add', (req, res) => {

    const productId = Number(req.body.productId);

    const products = req.app.locals.products;

    const product = products.find(
        product => product.id === productId
    );

    if (!product) {
        return res.redirect('/shop');
    }


    // Prevent duplicate wishlist entries
    const existingItem = wishlist.find(
        item => item.productId === product.id
    );


    if (existingItem) {

        existingItem.wishlistClicks =
            (existingItem.wishlistClicks || 1) + 1;

        return res.redirect('/shop');
    }


    // Add product to wishlist
    wishlist.push({

        id: Date.now(),

        productId: product.id,

        name: product.name,

        productPage: `/product-${product.id}.html`,

        image: product.image,

        platform: product.platform,

        genre: product.category,

        rating: product.rating === 5
            ? "⭐⭐⭐⭐⭐"
            : "⭐⭐⭐⭐☆",

        ratingCount: product.ratingCount
            ? `${product.ratingCount.toLocaleString()} reviews`
            : "",

        oldPrice: product.oldPrice,

        newPrice: product.price,

        discount: product.discount || 0,

        stock: product.stock === 0
            ? "Out of Stock"
            : product.stock <= 6
                ? "Low Stock"
                : "In Stock",

        stockClass: product.stock === 0
            ? "out-stock"
            : product.stock <= 6
                ? "low-stock"
                : "in-stock",

        usersWishlisted: 0,

        wishlistClicks: 1,

        addedToCart: 0,

        purchasedCount: 0,

        addedDate: new Date().toLocaleDateString(
            'en-GB',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }
        ),

        isPurchased: false

    });


    res.redirect('/shop');

});


// Move to Cart
router.get('/move/:id', (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(
        item => item.id === id
    );


    if (!item) {
        return res.redirect('/wishlist');
    }


    if (item.isPurchased) {
        return res.redirect('/wishlist');
    }


    if (item.stock === 'Out of Stock') {
        return res.redirect('/wishlist');
    }


    const cart = req.app.locals.cart;


    const existingItem = cart.find(
        cartItem => cartItem.id === item.productId
    );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id: item.productId,

            name: item.name,

            image: item.image,

            price: item.newPrice,

            quantity: 1

        });

    }


    item.addedToCart =
        (item.addedToCart || 0) + 1;


    res.redirect('/wishlist');

});


// Mark Purchased
router.get('/purchase/:id', (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(
        item => item.id === id
    );


    if (!item) {
        return res.redirect('/wishlist');
    }


    item.isPurchased = true;

    res.redirect('/wishlist');

});


// Mark Unpurchased
router.get('/unpurchase/:id', (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(
        item => item.id === id
    );


    if (!item) {
        return res.redirect('/wishlist');
    }


    item.isPurchased = false;

    res.redirect('/wishlist');

});


// Remove from Wishlist
router.get('/remove/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = wishlist.findIndex(
        item => item.id === id
    );


    if (index === -1) {
        return res.redirect('/wishlist');
    }


    wishlist.splice(index, 1);

    res.redirect('/wishlist');

});


module.exports = router;