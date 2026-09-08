const express = require('express');

const router = express.Router();

const cartService = require('../services/cartService');
const wishlistService = require('../services/wishlistService');
const orderService = require('../services/orderService');


// ============================================================
// LOGIN REQUIRED
// ============================================================

const requireLogin = (req, res, next) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();
};

router.use(requireLogin);


// ============================================================
// GET USER ID
// ============================================================

const getUserId = (req) => {

    return req.session.user._id ||
           req.session.user.id;

};


// ============================================================
// SHOW CART
// ============================================================

router.get('/', async (req, res) => {

    try {

        const userId = getUserId(req);

        // Load cart from MongoDB
        const cartData =
            await cartService.getCart(userId);

        // Calculate totals
        const totals =
            cartService.calculateTotals(cartData);


        // Convert MongoDB cart into format used by cart.ejs
        const cart =
            cartData.items.map(item => ({

                id: item.productId
                    ? item.productId.productId
                    : null,

                name: item.name,

                image: item.image,

                price: item.price,

                quantity: item.quantity

            }));


        // Cart count
        const cartCount =
            cart.reduce(
                (total, item) =>
                    total + (item.quantity || 0),
                0
            );


        // Load wishlist from MongoDB
        const wishlistData =
            await wishlistService.getWishlist(userId);


        // Wishlist count
        const wishlistCount =
            wishlistData.items.reduce(
                (total, item) =>
                    total + (item.wishlistClicks || 1),
                0
            );


        res.render('cart', {

            cart,

            cartCount,

            wishlistCount,

            subtotal: totals.subtotal,

            shipping: totals.shipping,

            tax: totals.tax,

            total: totals.total,

            user: req.session.user || null

        });


    } catch (error) {

        console.error(
            'Error loading cart:',
            error
        );

        req.session.errorMessage =
            'Unable to load your cart.';

        res.redirect('/shop');

    }

});


// ============================================================
// ADD TO CART FROM SHOP
// ============================================================

router.post('/add', async (req, res) => {

    try {

        const userId = getUserId(req);

        const productId =
            Number(req.body.productId);

        const quantity =
            Number(req.body.quantity) || 1;


        await cartService.addToCart(
            userId,
            productId,
            quantity
        );


        res.redirect('/shop');


    } catch (error) {

        console.error(
            'Error adding item to cart:',
            error
        );

        req.session.errorMessage =
            error.message;

        res.redirect('/shop');

    }

});


// ============================================================
// MOVE TO CART
// ============================================================

router.get('/add/:id', async (req, res) => {

    try {

        const userId = getUserId(req);

        const productId =
            Number(req.params.id);


        await cartService.addToCart(
            userId,
            productId,
            1
        );


        res.redirect('/wishlist');


    } catch (error) {

        console.error(
            'Error moving item to cart:',
            error
        );

        req.session.errorMessage =
            error.message;

        res.redirect('/wishlist');

    }

});


// ============================================================
// REMOVE FROM CART
// ============================================================

router.get('/remove/:id', async (req, res) => {

    try {

        const userId = getUserId(req);

        const productId =
            Number(req.params.id);


        await cartService.removeFromCart(
            userId,
            productId
        );


        res.redirect('/cart');


    } catch (error) {

        console.error(
            'Error removing item from cart:',
            error
        );

        req.session.errorMessage =
            error.message;

        res.redirect('/cart');

    }

});


// ============================================================
// CHECKOUT PAGE
// ============================================================

router.get('/checkout', async (req, res) => {

    try {

        const userId = getUserId(req);

        const cartData =
            await cartService.getCart(userId);


        // Do not allow checkout with an empty cart
        if (
            !cartData ||
            cartData.items.length === 0
        ) {

            return res.redirect('/cart');

        }


        const totals =
            cartService.calculateTotals(cartData);


        // Convert MongoDB cart into checkout format
        const cart =
            cartData.items.map(item => ({

                id: item.productId
                    ? item.productId.productId
                    : null,

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
            error
        );

        req.session.errorMessage =
            'Unable to load checkout.';

        res.redirect('/cart');

    }

});


// ============================================================
// PLACE ORDER
// ============================================================

router.post('/checkout', async (req, res) => {

    try {

        const userId = getUserId(req);


        // --------------------------------------------------------
        // LOAD CART FROM MONGODB
        // --------------------------------------------------------

        const cartData =
            await cartService.getCart(userId);


        if (
            !cartData ||
            cartData.items.length === 0
        ) {

            return res.redirect('/cart');

        }


        // --------------------------------------------------------
        // CART ITEMS
        // --------------------------------------------------------

        const cart =
            cartData.items.map(item => ({

                id: item.productId
                    ? item.productId.productId
                    : null,

                name: item.name,

                image: item.image,

                price: item.price,

                quantity: item.quantity

            }));


        // --------------------------------------------------------
        // FORM DATA
        // --------------------------------------------------------

        const firstName =
            (req.body['first-name'] || '').trim();

        const lastName =
            (req.body['last-name'] || '').trim();

        const email =
            (req.body.email || '').trim();

        const phone =
            (req.body.phone || '').trim();

        const address =
            (req.body.address || '').trim();

        const city =
            (req.body.city || '').trim();

        const postcode =
            (req.body.postcode || '').trim();

        const country =
            req.body.country;

        const delivery =
            req.body.delivery;

        const cardName =
            (req.body['card-name'] || '').trim();

        const cardNumber =
            (req.body['card-number'] || '')
                .replace(/\s/g, '');

        const expiry =
            (req.body.expiry || '').trim();

        const cvv =
            (req.body.cvv || '').trim();

        const cardType =
            req.body['card-type'];

        const terms =
            req.body.terms;


        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        const nameRegex =
            /^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u;

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        // First name
        if (!nameRegex.test(firstName)) {

            return await renderCheckoutError(
                res,
                'First name must contain letters and spaces only.',
                req.body,
                userId
            );

        }


        // Last name
        if (!nameRegex.test(lastName)) {

            return await renderCheckoutError(
                res,
                'Last name must contain letters and spaces only.',
                req.body,
                userId
            );

        }


        // Email
        if (!emailRegex.test(email)) {

            return await renderCheckoutError(
                res,
                'Please enter a valid email address.',
                req.body,
                userId
            );

        }


        // Phone
        if (!/^0\d{9}$/.test(phone)) {

            return await renderCheckoutError(
                res,
                'Phone number must contain exactly 10 digits and start with 0.',
                req.body,
                userId
            );

        }


        // Address
        if (address.length < 5) {

            return await renderCheckoutError(
                res,
                'Please enter a valid street address.',
                req.body,
                userId
            );

        }


        // City
        if (!nameRegex.test(city)) {

            return await renderCheckoutError(
                res,
                'City must contain letters and spaces only.',
                req.body,
                userId
            );

        }


        // Postcode
        if (!/^\d{4,7}$/.test(postcode)) {

            return await renderCheckoutError(
                res,
                'Postcode must contain 4 to 7 digits.',
                req.body,
                userId
            );

        }


        // Delivery
        if (
            !['standard', 'express', 'pickup']
                .includes(delivery)
        ) {

            return await renderCheckoutError(
                res,
                'Please select a valid delivery method.',
                req.body,
                userId
            );

        }


        // Card name
        if (!nameRegex.test(cardName)) {

            return await renderCheckoutError(
                res,
                'Name on card must contain letters and spaces only.',
                req.body,
                userId
            );

        }


        // Card number
        if (!/^\d{16}$/.test(cardNumber)) {

            return await renderCheckoutError(
                res,
                'Card number must contain exactly 16 digits.',
                req.body,
                userId
            );

        }


        // Expiry
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {

            return await renderCheckoutError(
                res,
                'Expiry date must use MM/YY format.',
                req.body,
                userId
            );

        }


        const [expiryMonth, expiryYear] =
            expiry.split('/').map(Number);


        const currentDate =
            new Date();

        const currentMonth =
            currentDate.getMonth() + 1;

        const currentYear =
            currentDate.getFullYear() % 100;


        // Expiry must be in the future
        if (
            expiryYear < currentYear ||
            (
                expiryYear === currentYear &&
                expiryMonth < currentMonth
            )
        ) {

            return await renderCheckoutError(
                res,
                'Card expiry date must be in the future.',
                req.body,
                userId
            );

        }


        // CVV
        if (!/^\d{3,4}$/.test(cvv)) {

            return await renderCheckoutError(
                res,
                'CVV must contain 3 or 4 digits.',
                req.body,
                userId
            );

        }


        // Terms
        if (!terms) {

            return await renderCheckoutError(
                res,
                'You must agree to the Terms and Conditions.',
                req.body,
                userId
            );

        }


        // --------------------------------------------------------
        // CALCULATE TOTALS
        // --------------------------------------------------------

        const subtotal = Number(
            cart.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            ).toFixed(2)
        );

        const shipping = subtotal >= 100 ? 0 : 10;

        const tax = Number(
            (subtotal * 0.1).toFixed(2)
        );

        const total = Number(
            (subtotal + shipping + tax).toFixed(2)
        );


        // --------------------------------------------------------
        // CREATE ORDER DATA
        // --------------------------------------------------------

        const orderData = {

            orderNumber:
                `CH-${Date.now()}`,

            firstName,

            lastName,

            email,

            phone,

            address,

            city,

            postcode,

            country,

            delivery,

            paymentMethod:
                cardType,

            deliveryDate:
                delivery === 'express'
                    ? '2-3 business days'
                    : delivery === 'pickup'
                        ? 'Ready in 24 hours'
                        : '5-7 business days',

            items:
                cartData.items.map(item => ({

                    productId:
                        item.productId._id,

                    productNumber:
                        item.productId.productId,

                    name:
                        item.name,

                    image:
                        item.image,

                    price:
                        item.price,

                    quantity:
                        item.quantity

                })),

            subtotal,

            shipping,

            tax,

            total

        };


        // --------------------------------------------------------
        // SAVE ORDER TO MONGODB
        // --------------------------------------------------------

        const savedOrder =
            await orderService.createOrder(
                userId,
                orderData
            );


        // Save order ID to session
        req.session.orderId =
            savedOrder._id;


        // --------------------------------------------------------
        // CLEAR CART
        // --------------------------------------------------------

        await cartService.clearCart(
            userId
        );


        // --------------------------------------------------------
        // ORDER CONFIRMATION
        // --------------------------------------------------------

        res.redirect(
            '/cart/order-confirmation'
        );


    } catch (error) {

        console.error(
            'Error creating order:',
            error
        );

        req.session.errorMessage =
            'Unable to place your order. Please try again.';

        res.redirect('/cart/checkout');

    }

});


// ============================================================
// CHECKOUT ERROR
// ============================================================

async function renderCheckoutError(
    res,
    error,
    body,
    userId
) {

    try {

        const cartData =
            await cartService.getCart(userId);


        const cart =
            cartData.items.map(item => ({

                id: item.productId
                    ? item.productId.productId
                    : null,

                name: item.name,

                image: item.image,

                price: item.price,

                quantity: item.quantity

            }));


        const totals =
            cartService.calculateTotals(
                cartData
            );


        res.render('checkout', {

            cart,

            subtotal: totals.subtotal,

            shipping: totals.shipping,

            tax: totals.tax,

            total: totals.total,

            user: reqUserForCheckout(userId),

            error,

            formData: {

                firstName:
                    body['first-name'] || '',

                lastName:
                    body['last-name'] || '',

                email:
                    body.email || '',

                phone:
                    body.phone || '',

                address:
                    body.address || '',

                city:
                    body.city || '',

                postcode:
                    body.postcode || '',

                country:
                    body.country || '',

                notes:
                    body.notes || '',

                delivery:
                    body.delivery || 'standard',

                cardName:
                    body['card-name'] || '',

                cardNumber:
                    body['card-number'] || '',

                expiry:
                    body.expiry || '',

                cvv:
                    body.cvv || '',

                cardType:
                    body['card-type'] || 'visa',

                terms:
                    body.terms || false

            }

        });


    } catch (dbError) {

        console.error(
            'Error loading cart for checkout error:',
            dbError
        );

        res.redirect('/cart');

    }

}


// ============================================================
// USER OBJECT FOR CHECKOUT ERROR
// ============================================================

function reqUserForCheckout(userId) {

    return {
        _id: userId
    };

}


// ============================================================
// ORDER CONFIRMATION
// ============================================================

router.get('/order-confirmation', async (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }


    if (!req.session.orderId) {
        return res.redirect('/shop');
    }


    try {

        const order =
            await orderService.getOrderById(
                req.session.orderId
            );


        if (!order) {
            return res.redirect('/shop');
        }


        res.render('order-confirmation', {

            user:
                req.session.user,

            order

        });


    } catch (error) {

        console.error(
            'Error loading order confirmation:',
            error
        );

        req.session.errorMessage =
            'Unable to load your order.';

        res.redirect('/shop');

    }

});


module.exports = router;