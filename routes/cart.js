const express = require('express');

const router = express.Router();


// Login required
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();
};


// Cart data
let cart = [];

router.use(requireLogin);


// Make cart available to other routes
router.use((req, res, next) => {
    req.app.locals.cart = cart;
    next();
});


// Show Cart
router.get('/', (req, res) => {

    const cartCount = cart.reduce(
        (total, item) => total + (item.quantity || 0),
        0
    );

    const wishlist = req.app.locals.wishlist || [];

    const wishlistCount = wishlist.reduce(
        (total, item) => total + (item.wishlistClicks || 1),
        0
    );

    res.render('cart', {
        cart: cart,
        cartCount: cartCount,
        wishlistCount: wishlistCount,
        user: req.session.user || null
    });

});


// Add to Cart from Shop
router.post('/add', (req, res) => {

    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity) || 1;

    const products = req.app.locals.products || [];

    const product = products.find(
        item => item.id === productId
    );


    // Product does not exist
    if (!product) {
        return res.redirect('/shop');
    }


    // Product is out of stock
    if (product.stock <= 0) {
        return res.redirect('/shop');
    }


    // Find existing item
    const existingItem = cart.find(
        item => item.id === productId
    );


    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            image: product.image,

            price: product.price,

            quantity: quantity

        });

    }


    req.app.locals.cart = cart;


    // Stay on Shop
    res.redirect('/shop');

});


// Move to Cart from Wishlist
router.get('/add/:id', (req, res) => {

    const id = Number(req.params.id);

    const wishlist = req.app.locals.wishlist || [];


    const item = wishlist.find(
        item => item.productId === id
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


    const existingItem = cart.find(
        cartItem => cartItem.id === id
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


    // Count Move to Cart
    item.addedToCart =
        (item.addedToCart || 0) + 1;


    req.app.locals.cart = cart;


    // Stay on Wishlist
    res.redirect('/wishlist');

});


// Remove item from Cart
router.get('/remove/:id', (req, res) => {

    const id = Number(req.params.id);


    cart = cart.filter(
        item => item.id !== id
    );


    req.app.locals.cart = cart;


    // Stay on Cart
    res.redirect('/cart');

});

// Checkout
router.get('/checkout', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = subtotal >= 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    res.render('checkout', {
        cart,
        subtotal,
        shipping,
        tax,
        total,
        user: req.session.user
    });
});


// Place Order
router.post('/checkout', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = subtotal >= 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const order = {
        orderNumber: `CH-${Date.now()}`,
        orderDate: new Date().toLocaleDateString(),

        firstName: req.body['first-name'],
        lastName: req.body['last-name'],
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        postcode: req.body.postcode,
        country: req.body.country,

        delivery: req.body.delivery,
        paymentMethod: req.body['card-type'],
        deliveryDate: req.body.delivery === 'express'
        ? '2-3 business days'
        : req.body.delivery === 'pickup'
            ? 'Ready in 24 hours'
            : '5-7 business days',

        customer: req.session.user,
        items: [...cart],
        subtotal,
        shipping,
        tax,
        total
    };

    req.session.order = order;

    cart.length = 0;
    req.app.locals.cart = cart;

    res.redirect('/cart/order-confirmation');
});

// Order Confirmation
router.get('/order-confirmation', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (!req.session.order) {
        return res.redirect('/shop');
    }

    res.render('order-confirmation', {
        user: req.session.user,
        order: req.session.order
    });
});

module.exports = router;