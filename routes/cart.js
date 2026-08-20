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
    user: req.session.user,
    formData: {}
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

    const firstName = (req.body['first-name'] || '').trim();
    const lastName = (req.body['last-name'] || '').trim();
    const email = (req.body.email || '').trim();
    const phone = (req.body.phone || '').trim();
    const address = (req.body.address || '').trim();
    const city = (req.body.city || '').trim();
    const postcode = (req.body.postcode || '').trim();
    const country = req.body.country;
    const delivery = req.body.delivery;
    const cardName = (req.body['card-name'] || '').trim();
    const cardNumber = (req.body['card-number'] || '').replace(/\s/g, '');
    const expiry = (req.body.expiry || '').trim();
    const cvv = (req.body.cvv || '').trim();
    const cardType = req.body['card-type'];
    const terms = req.body.terms;

    const nameRegex =
        /^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u;

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // First Name
    if (!nameRegex.test(firstName)) {
        return renderCheckoutError(
            res,
            'First name must contain letters and spaces only.',
            req.body
        );
    }


    // Last Name
    if (!nameRegex.test(lastName)) {
        return renderCheckoutError(
            res,
            'Last name must contain letters and spaces only.',
            req.body
        );
    }


    // Email
    if (!emailRegex.test(email)) {
        return renderCheckoutError(
            res,
            'Please enter a valid email address.',
            req.body
        );
    }


    // Phone
    if (!/^0\d{9}$/.test(phone)) {
        return renderCheckoutError(
            res,
            'Phone number must contain exactly 10 digits and start with 0.',
            req.body
        );
    }


    // Address
    if (address.length < 5) {
        return renderCheckoutError(
            res,
            'Please enter a valid street address.',
            req.body
        );
    }


    // City
    if (!nameRegex.test(city)) {
        return renderCheckoutError(
            res,
            'City must contain letters and spaces only.',
            req.body
        );
    }


    // Postcode
    if (!/^\d{4,7}$/.test(postcode)) {
        return renderCheckoutError(
            res,
            'Postcode must contain 4 to 7 digits.',
            req.body
        );
    }


    // Delivery
    if (!['standard', 'express', 'pickup'].includes(delivery)) {
        return renderCheckoutError(
            res,
            'Please select a valid delivery method.',
            req.body
        );
    }


    // Card Name
    if (!nameRegex.test(cardName)) {
        return renderCheckoutError(
            res,
            'Name on card must contain letters and spaces only.',
            req.body
        );
    }


    // Card Number
    if (!/^\d{16}$/.test(cardNumber)) {
        return renderCheckoutError(
            res,
            'Card number must contain exactly 16 digits.',
            req.body
        );
    }


    // Expiry
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        return renderCheckoutError(
            res,
            'Expiry date must use MM/YY format.',
            req.body
        );
    }


    const [expiryMonth, expiryYear] =
        expiry.split('/').map(Number);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (
        expiryYear < currentYear ||
        (expiryYear === currentYear &&
            expiryMonth < currentMonth)
    ) {
        return renderCheckoutError(
            res,
            'Card expiry date must be in the future.',
            req.body
        );
    }


    // CVV
    if (!/^\d{3,4}$/.test(cvv)) {
        return renderCheckoutError(
            res,
            'CVV must contain 3 or 4 digits.',
            req.body
        );
    }


    // Terms
    if (!terms) {
        return renderCheckoutError(
            res,
            'You must agree to the Terms and Conditions.',
            req.body
        );
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

        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        postcode,
        country,

        delivery,

        paymentMethod: cardType,

        deliveryDate:
            delivery === 'express'
                ? '2-3 business days'
                : delivery === 'pickup'
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


// Show checkout error
function renderCheckoutError(res, error, body) {

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

        user: null,

        error,

        formData: {
            firstName: body['first-name'] || '',
            lastName: body['last-name'] || '',
            email: body.email || '',
            phone: body.phone || '',
            address: body.address || '',
            city: body.city || '',
            postcode: body.postcode || '',
            country: body.country || '',
            notes: body.notes || '',
            delivery: body.delivery || 'standard',
            cardName: body['card-name'] || '',
            cardNumber: body['card-number'] || '',
            expiry: body.expiry || '',
            cvv: body.cvv || '',
            cardType: body['card-type'] || 'visa',
            terms: body.terms || false
        }
    });
}

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