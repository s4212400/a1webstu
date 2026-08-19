const express = require('express');

const router = express.Router();


// ============================================================
// PRODUCT DATA
// ============================================================

const products = [
    {
        id: 1,
        name: "PlayStation 5 Slim",
        category: "console",
        platform: "ps5",
        image: "/images/ps5.jpg",
        oldPrice: 649.99,
        price: 599.99,
        discount: 8,
        condition: "new",
        rating: 5,
        ratingCount: 1842,
        stock: 24
    },
    {
        id: 2,
        name: "Xbox Series X",
        category: "console",
        platform: "xbox",
        image: "/images/xbox.jpg",
        price: 549.99,
        condition: "new",
        rating: 4,
        ratingCount: 1205,
        stock: 17
    },
    {
        id: 3,
        name: "Nintendo Switch OLED",
        category: "console",
        platform: "switch",
        image: "/images/nintendo_oled.jpg",
        oldPrice: 399.99,
        price: 349.99,
        discount: 12,
        condition: "new",
        rating: 5,
        ratingCount: 2310,
        stock: 4
    },
    {
        id: 4,
        name: "DualSense Wireless Controller",
        category: "accessory",
        platform: "ps5",
        image: "/images/ps_controller.jpg",
        price: 74.99,
        condition: "new",
        rating: 4,
        ratingCount: 864,
        stock: 52
    },
    {
        id: 5,
        name: "Pulse 3D Wireless Headset",
        category: "accessory",
        platform: "ps5",
        image: "/images/pulse_headset.jpg",
        oldPrice: 99.99,
        price: 79.99,
        discount: 20,
        condition: "new",
        rating: 4,
        ratingCount: 731,
        stock: 33
    },
    {
        id: 6,
        name: "Zelda: Tears of the Kingdom",
        category: "game",
        platform: "switch",
        image: "/images/zelda_totk.jpg",
        oldPrice: 69.99,
        price: 54.99,
        discount: 20,
        condition: "new",
        rating: 5,
        ratingCount: 2481,
        stock: 41
    },
    {
        id: 7,
        name: "Marvel's Spider-Man 2",
        category: "game",
        platform: "ps5",
        image: "/images/spiderman2.jpg",
        oldPrice: 69.99,
        price: 49.99,
        discount: 30,
        condition: "new",
        rating: 5,
        ratingCount: 3107,
        stock: 6
    },
    {
        id: 8,
        name: "Mario Kart 8 Deluxe",
        category: "game",
        platform: "switch",
        image: "/images/mario_kart.jpg",
        price: 59.99,
        condition: "new",
        rating: 5,
        ratingCount: 5092,
        stock: 68
    },
    {
        id: 9,
        name: "Astro Bot",
        category: "game",
        platform: "ps5",
        image: "/images/astrobot.jpg",
        price: 59.99,
        condition: "new",
        rating: 5,
        ratingCount: 2754,
        stock: 37
    },
    {
        id: 10,
        name: "Cyberpunk 2077: Ultimate",
        category: "game",
        platform: "ps5",
        image: "/images/cyberpunk.jpg",
        oldPrice: 79.99,
        price: 49.99,
        discount: 38,
        condition: "new",
        rating: 4,
        ratingCount: 3918,
        stock: 28
    },
    {
        id: 11,
        name: "Elden Ring",
        category: "game",
        platform: "ps5",
        image: "/images/eldenring.jpg",
        oldPrice: 59.99,
        price: 39.99,
        discount: 35,
        condition: "new",
        rating: 5,
        ratingCount: 4265,
        stock: 0
    },
    {
        id: 12,
        name: "Animal Crossing: New Horizons",
        category: "game",
        platform: "switch",
        image: "/images/animalcrossing.jpg",
        price: 42.99,
        condition: "new",
        rating: 5,
        ratingCount: 6102,
        stock: 55
    },
    {
        id: 13,
        name: "Kirby's Return to Dream Land",
        category: "game",
        platform: "switch",
        image: "/images/kirby.jpg",
        oldPrice: 49.99,
        price: 39.99,
        discount: 20,
        condition: "new",
        rating: 4,
        ratingCount: 1486,
        stock: 22
    },
    {
        id: 14,
        name: "Persona 3 Reload",
        category: "game",
        platform: "ps5",
        image: "/images/persona3.jpg",
        price: 49.99,
        condition: "new",
        rating: 5,
        ratingCount: 2047,
        stock: 5
    },
    {
        id: 15,
        name: "Metaphor: ReFantazio",
        category: "game",
        platform: "ps5",
        image: "/images/metaphor.jpg",
        price: 59.99,
        condition: "new",
        rating: 5,
        ratingCount: 1733,
        stock: 19
    },
    {
        id: 16,
        name: "Gran Turismo 7: BMW Pack",
        category: "game",
        platform: "ps5",
        image: "/images/bmw.jpg",
        oldPrice: 89.99,
        price: 69.99,
        discount: 22,
        condition: "new",
        rating: 4,
        ratingCount: 942,
        stock: 3
    },
    {
        id: 17,
        name: "Nintendo Switch Lite",
        category: "console",
        platform: "switch",
        image: "/images/nintendo_2.jpg",
        price: 219.99,
        condition: "new",
        rating: 4,
        ratingCount: 3201,
        stock: 31
    },
    {
        id: 18,
        name: "Switch Pro Controller",
        category: "accessory",
        platform: "switch",
        image: "/images/nin_controller.jpg",
        oldPrice: 79.99,
        price: 64.99,
        discount: 19,
        condition: "new",
        rating: 5,
        ratingCount: 2588,
        stock: 44
    },
    {
        id: 19,
        name: "DualSense Charging Station",
        category: "accessory",
        platform: "ps5",
        image: "/images/ps_charging_dock.jpg",
        price: 34.99,
        condition: "new",
        rating: 4,
        ratingCount: 671,
        stock: 60
    },
    {
        id: 20,
        name: "Super Mario Bros Wonder",
        category: "game",
        platform: "switch",
        image: "/images/mario.jpg",
        oldPrice: 59.99,
        price: 44.99,
        discount: 25,
        condition: "new",
        rating: 5,
        ratingCount: 1932,
        stock: 26
    }
];


// ============================================================
// VALIDATION
// ============================================================

function validateProduct(product) {
    if (!product) {
        return false;
    }

    if (!product.id || !product.name) {
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


// Validate all products when the route file loads
const validProducts = products.filter(validateProduct);


// ============================================================
// SHOP ROUTE
// ============================================================

router.get('/', (req, res) => {

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
    // FILTER PRODUCTS
    // ========================================================

    let filteredProducts = validProducts.filter(product => {

        // Search
        const productName = String(
            product.name || ''
        ).toLowerCase();

        if (
            search &&
            !productName.includes(search)
        ) {
            return false;
        }


        // Category
        if (
            categories.length > 0 &&
            !categories.includes(product.category)
        ) {
            return false;
        }


        // Platform
        if (
            platforms.length > 0 &&
            !platforms.includes(product.platform)
        ) {
            return false;
        }


        // Condition
        const productCondition =
            product.condition || 'new';

        if (
            condition !== 'all' &&
            productCondition !== condition
        ) {
            return false;
        }


        // Price
        const price = Number(product.price) || 0;

        if (
            price < minPrice ||
            price > maxPrice
        ) {
            return false;
        }


        // Stock
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

});


// ============================================================
// EXPORT ROUTER
// ============================================================

router.products = products;

module.exports = router;