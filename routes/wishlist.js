const express = require('express');

const router = express.Router();

const wishlistService = require('../services/wishlistService');


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
// SHOW WISHLIST
// ============================================================

router.get('/', async (req, res) => {

    try {

        const userId = getUserId(req);

        const wishlistData =
            await wishlistService.getWishlist(userId);


        const wishlist =
            wishlistData.items.map(item => ({

                id: item._id,

                productId: item.productNumber,

                name: item.name,

                productPage:
                    `/product-${item.productNumber}.html`,

                image: item.image,

                platform: item.platform,

                genre: item.category,

                rating:
                    item.rating === 5
                        ? "⭐⭐⭐⭐⭐"
                        : "⭐⭐⭐⭐☆",

                ratingCount:
                    item.ratingCount
                        ? `${item.ratingCount.toLocaleString()} reviews`
                        : "",

                oldPrice:
                    item.oldPrice,

                newPrice:
                    item.price,

                discount:
                    item.discount || 0,

                stock:
                    item.stock === 0
                        ? "Out of Stock"
                        : item.stock <= 6
                            ? "Low Stock"
                            : "In Stock",

                stockClass:
                    item.stock === 0
                        ? "out-stock"
                        : item.stock <= 6
                            ? "low-stock"
                            : "in-stock",

                usersWishlisted: 0,

                wishlistClicks:
                    item.wishlistClicks || 1,

                addedToCart:
                    item.addedToCart || 0,

                purchasedCount:
                    item.purchasedCount || 0,

                addedDate:
                    new Date(item.addedDate)
                        .toLocaleDateString(
                            'en-GB',
                            {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }
                        ),

                isPurchased:
                    item.isPurchased || false

            }));


        // ========================================================
        // COUNTS
        // ========================================================

        const wishlistCount =
            wishlist.reduce(
                (total, item) =>
                    total +
                    (item.wishlistClicks || 1),
                0
            );


        const cart =
            req.app.locals.cart || [];


        const cartCount =
            cart.reduce(
                (total, item) =>
                    total +
                    (item.quantity || 0),
                0
            );


        // ========================================================
        // RENDER
        // ========================================================
        
        res.render('wishlist',{
            wishlist,
            wishlistCount,
            cartCount,
            user:req.session.user||null
        });


    } catch (error) {

        console.error(
            'Error loading wishlist:',
            error
        );

        req.session.errorMessage =
            'Unable to load your wishlist.';

        res.redirect('/shop');

    }

});


// ============================================================
// ADD PRODUCT TO WISHLIST
// ============================================================

router.post('/add', async (req, res) => {

    try {

        const userId = getUserId(req);

        const productId =
            Number(req.body.productId);


        await wishlistService.addToWishlist(
            userId,
            productId
        );


        res.redirect('/shop');


    } catch (error) {

        console.error(
            'Error adding product to wishlist:',
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

router.get('/move/:id', async (req, res) => {

    try {

        const userId = getUserId(req);

        const itemId =
            req.params.id;


        const wishlistData =
            await wishlistService.getWishlist(
                userId
            );


        const item =
            wishlistData.items.id(itemId);


        if (!item) {
            return res.redirect('/wishlist');
        }


        if (item.isPurchased) {
            return res.redirect('/wishlist');
        }


        if (item.stock === 0) {
            return res.redirect('/wishlist');
        }


        // Add product to MongoDB cart
        const cartService =
            require('../services/cartService');


        await cartService.addToCart(
            userId,
            item.productNumber,
            1
        );


        // Increase wishlist cart count
        await wishlistService.incrementAddedToCart(
            userId,
            itemId
        );


        res.redirect('/wishlist');


    } catch (error) {

        console.error(
            'Error moving wishlist item to cart:',
            error
        );

        req.session.errorMessage =
            error.message;

        res.redirect('/wishlist');

    }

});


// ============================================================
// MARK PURCHASED
// ============================================================

router.get('/purchase/:id', async (req, res) => {

    try {

        const userId = getUserId(req);

        const itemId =
            req.params.id;


        await wishlistService.markPurchased(
            userId,
            itemId
        );


        res.redirect('/wishlist');


    } catch (error) {

        console.error(
            'Error marking wishlist item as purchased:',
            error
        );

        req.session.errorMessage =
            error.message;

        res.redirect('/wishlist');

    }

});


// ============================================================
// MARK UNPURCHASED
// ============================================================

router.get('/unpurchase/:id', async (req, res) => {

    try {

        const userId = getUserId(req);

        const itemId =
            req.params.id;


        await wishlistService.markUnpurchased(
            userId,
            itemId
        );


        res.redirect('/wishlist');


    } catch (error) {

        console.error(
            'Error marking wishlist item as unpurchased:',
            error
        );

        req.session.errorMessage =
            error.message;

        res.redirect('/wishlist');

    }

});


// ============================================================
// REMOVE FROM WISHLIST
// ============================================================

router.get('/remove/:id', async (req, res) => {

    try {

        const userId = getUserId(req);

        const itemId =
            req.params.id;


        await wishlistService.removeFromWishlist(
            userId,
            itemId
        );


        res.redirect('/wishlist');


    } catch (error) {

        console.error(
            'Error removing wishlist item:',
            error
        );

        req.session.errorMessage =
            error.message;

        res.redirect('/wishlist');

    }

});


module.exports = router;