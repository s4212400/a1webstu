const express = require('express');

const router = express.Router();

const cartService = require('../services/cartService');
const orderService = require('../services/orderService');

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
router.get('/', async (req, res) => {
    try {
        const userId = req.session.user._id;

        const cartData = await cartService.getCart(userId);
        const totals = cartService.calculateTotals(cartData);

        const cart = cartData.items.map(item => ({
            id: item.productId.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
        }));

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
            subtotal: totals.subtotal,
            shipping: totals.shipping,
            tax: totals.tax,
            total: totals.total,
            user: req.session.user || null
        });

    } catch (error) {
        console.error(
            'Error loading cart:',
            error.message
        );

        req.session.errorMessage = 'Unable to load your cart.';
        res.redirect('/shop');
    }
});

// Add to Cart from Shop
router.post('/add', async (req, res) => {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity) || 1;

    try {
        const userId = req.session.user._id;

        await cartService.addToCart(
            userId,
            productId,
            quantity
        );

        res.redirect('/shop');

    } catch (error) {
        console.error(
            'Error adding item to cart:',
            error.message
        );

        req.session.errorMessage = error.message;
        res.redirect('/shop');
    }
});

// Move to Cart from Wishlist
router.get('/add/:id', async (req, res) => {
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

    try {
        const userId = req.session.user._id;

        await cartService.addToCart(
            userId,
            id,
            1
        );

        // Count Move to Cart
        item.addedToCart =
            (item.addedToCart || 0) + 1;

        // Stay on Wishlist
        res.redirect('/wishlist');

    } catch (error) {
        console.error(
            'Error moving wishlist item to cart:',
            error.message
        );

        req.session.errorMessage = error.message;
        res.redirect('/wishlist');
    }
});

// Remove item from Cart
router.get('/remove/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const userId = req.session.user._id;

        await cartService.removeFromCart(
            userId,
            id
        );

        // Stay on Cart
        res.redirect('/cart');

    } catch (error) {
        console.error(
            'Error removing item from cart:',
            error.message
        );

        req.session.errorMessage = error.message;
        res.redirect('/cart');
    }
});

// Checkout
router.get('/checkout', async (req, res) => {
    try {
        const userId = req.session.user._id;

        const cartData = await cartService.getCart(userId);

        if (!cartData || cartData.items.length === 0) {
            return res.redirect('/cart');
        }

        const totals = cartService.calculateTotals(cartData);

        const cart = cartData.items.map(item => ({
            id: item.productId.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
        }));

        res.render('checkout', {
            cart,
            subtotal: totals.subtotal,
            shipping: totals.shipping,
            tax: totals.tax,
            total: totals.total,
            user: req.session.user,
            formData: {}
        });

    } catch (error) {
        console.error(
            'Error loading checkout:',
            error.message
        );

        req.session.errorMessage = 'Unable to load checkout.';
        res.redirect('/cart');
    }
});

// Place Order
router.post('/checkout', async (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    let cartData;

    try {
        cartData = await cartService.getCart(
            req.session.user._id
        );
    } catch (error) {
        console.error(
            'Error loading cart:',
            error.message
        );

        req.session.errorMessage = 'Unable to load your cart.';
        return res.redirect('/cart');
    }

    if (!cartData || cartData.items.length === 0) {
        return res.redirect('/cart');
    }

    const cart = cartData.items.map(item => ({
        id: item.productId.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
    }));

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
        return await renderCheckoutError(
            res,
            'First name must contain letters and spaces only.',
            req.body,
            req.session.user._id
        );
    }

    // Last Name
    if (!nameRegex.test(lastName)) {
        return await renderCheckoutError(
            res,
            'Last name must contain letters and spaces only.',
            req.body,
            req.session.user._id
        );
    }

    // Email
    if (!emailRegex.test(email)) {
        return await renderCheckoutError(
            res,
            'Please enter a valid email address.',
            req.body,
            req.session.user._id
        );
    }

    // Phone
    if (!/^0\d{9}$/.test(phone)) {
        return await renderCheckoutError(
            res,
            'Phone number must contain exactly 10 digits and start with 0.',
            req.body,
            req.session.user._id
        );
    }

    // Address
    if (address.length < 5) {
        return await renderCheckoutError(
            res,
            'Please enter a valid street address.',
            req.body,
            req.session.user._id
        );
    }

    // City
    if (!nameRegex.test(city)) {
        return await renderCheckoutError(
            res,
            'City must contain letters and spaces only.',
            req.body,
            req.session.user._id
        );
    }

    // Postcode
    if (!/^\d{4,7}$/.test(postcode)) {
        return await renderCheckoutError(
            res,
            'Postcode must contain 4 to 7 digits.',
            req.body,
            req.session.user._id
        );
    }

    // Delivery
    if (!['standard', 'express', 'pickup'].includes(delivery)) {
        return await renderCheckoutError(
            res,
            'Please select a valid delivery method.',
            req.body,
            req.session.user._id
        );
    }

    // Card Name
    if (!nameRegex.test(cardName)) {
        return await renderCheckoutError(
            res,
            'Name on card must contain letters and spaces only.',
            req.body,
            req.session.user._id
        );
    }

    // Card Number
    if (!/^\d{16}$/.test(cardNumber)) {
        return await renderCheckoutError(
            res,
            'Card number must contain exactly 16 digits.',
            req.body,
            req.session.user._id
        );
    }

    // Expiry
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        return await renderCheckoutError(
            res,
            'Expiry date must use MM/YY format.',
            req.body,
            req.session.user._id
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
        return await renderCheckoutError(
            res,
            'Card expiry date must be in the future.',
            req.body,
            req.session.user._id
        );
    }

    // CVV
    if (!/^\d{3,4}$/.test(cvv)) {
        return await renderCheckoutError(
            res,
            'CVV must contain 3 or 4 digits.',
            req.body,
            req.session.user._id
        );
    }

    // Terms
    if (!terms) {
        return await renderCheckoutError(
            res,
            'You must agree to the Terms and Conditions.',
            req.body,
            req.session.user._id
        );
    }

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = subtotal >= 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const orderData = {
    orderNumber: `CH-${Date.now()}`,

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

    items: cartData.items.map(item => ({
        productId: item.productId._id,
        productNumber: item.productId.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
    })),

    subtotal,
    shipping,
    tax,
    total
};

try {
    const savedOrder = await orderService.createOrder(
        req.session.user._id,
        orderData
    );

    // Store only the MongoDB Order ID in session
    req.session.orderId = savedOrder._id;

    // Clear the user's cart from MongoDB
    await cartService.clearCart(
        req.session.user._id
    );

    res.redirect('/cart/order-confirmation');

} catch (error) {
    console.error(
        'Error creating order:',
        error.message
    );

    req.session.errorMessage =
        'Unable to place your order. Please try again.';

    res.redirect('/cart/checkout');
}
});

// Show checkout error
async function renderCheckoutError(
    res,
    error,
    body,
    userId
) {
    try {
        const cartData =
            await cartService.getCart(userId);

        const cart = cartData.items.map(item => ({
            id: item.productId.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
        }));

        const totals =
            cartService.calculateTotals(cartData);

        res.render('checkout', {
            cart,
            subtotal: totals.subtotal,
            shipping: totals.shipping,
            tax: totals.tax,
            total: totals.total,
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

    } catch (dbError) {
        console.error(
            'Error loading cart for checkout error:',
            dbError.message
        );

        res.redirect('/cart');
    }
}

// Order Confirmation
router.get('/order-confirmation', async (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (!req.session.orderId) {
        return res.redirect('/shop');
    }

    try {
        const order = await orderService.getOrderById(
            req.session.orderId
        );

        if (!order) {
            return res.redirect('/shop');
        }

        res.render('order-confirmation', {
            user: req.session.user,
            order: order
        });

    } catch (error) {
        console.error(
            'Error loading order confirmation:',
            error.message
        );

        req.session.errorMessage =
            'Unable to load your order.';

        res.redirect('/shop');
    }
});

module.exports = router;