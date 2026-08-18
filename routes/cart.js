const express = require('express');

const router = express.Router();


// Cart data
let cart = [];


// Make cart available to server.js
router.use((req, res, next) => {
    req.app.locals.cart = cart;
    next();
});


// Show Cart
router.get('/', (req, res) => {

    res.render('cart', {
        cart: cart,
        user: req.session.user || null
    });

});


// Add item to Cart
router.get('/add/:id', (req, res) => {

    const id = Number(req.params.id);

    const wishlist = req.app.locals.wishlist;

    const item = wishlist.find(item => item.id === id);

    if (!item) {
        return res.redirect('/wishlist');
    }

    if (item.isPurchased) {
        return res.redirect('/wishlist');
    }

    if (item.stock === 'Out of Stock') {
        return res.redirect('/wishlist');
    }

    const existingItem = cart.find(
        cartItem => cartItem.id === id
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            ...item,
            quantity: 1
        });

    }

    item.addedToCart++;

    res.redirect('/cart');

});


// Remove item from Cart
router.get('/remove/:id', (req, res) => {

    const id = Number(req.params.id);

    cart = cart.filter(
        item => item.id !== id
    );

    req.app.locals.cart = cart;

    res.redirect('/cart');

});


module.exports = router;