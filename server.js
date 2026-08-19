const express = require('express');
const session = require('express-session');
const path = require('path');
const cartRouter = require('./routes/cart');
const wishlistRouter = require('./routes/wishlist');

const app = express();
const PORT = 3000;

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// Session to remember logged-in user
app.use(session({
    secret: 'consolehaven-secret',
    resave: false,
    saveUninitialized: false
}));

// In-memory users
let users = [
    {
        id: 1,
        fullname: "Admin Test",
        username: "admin123",
        email: "admin@gmail.com",
        password: "password123",
        description: "I am the admin"
    }
];

// In-memory product catalog
let products = [
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

// Make products available to route modules
app.locals.products = products;

// Reviews route
// ===== MODULE ROUTES =====
const reviewsRouter = require('./routes/reviews');
app.use('/reviews', reviewsRouter);

// Blog route (teammate)
const blogRouter = require('./routes/blog');
app.use('/blog', blogRouter);

// Forum route (teammate)
const forumRouter = require('./routes/forum');
app.use('/forum', forumRouter);


// Cart and Wishlist routes - add back when teammates implement them
// const cartRouter = require('./routes/cart');
// app.use('/cart', cartRouter);
// const wishlistRouter = require('./routes/wishlist');
// app.use('/wishlist', wishlistRouter);

// Shop
app.get('/shop', (req, res) => {

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


    // =========================
    // FILTER VALUES
    // =========================

    const search = (req.query.search || '').trim().toLowerCase();

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


    // =========================
    // FILTER PRODUCTS
    // =========================

    let filteredProducts = products.filter(product => {

        // Search
        const productName =
            String(product.name || '').toLowerCase();

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

        if (price < minPrice || price > maxPrice) {
            return false;
        }


        // Availability
        if (stockOptions.length > 0) {

            const stock = Number(product.stock) || 0;

            let stockMatch = false;


            // In Stock = anything above 0
            if (
                stockOptions.includes('in') &&
                stock > 0
            ) {
                stockMatch = true;
            }


            // Low Stock = 1–6
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


    // =========================
    // SORT
    // =========================

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


    // =========================
    // RENDER SHOP
    // =========================

res.render('shop', {
    products: filteredProducts,
    wishlistCount: wishlistCount,
    cartCount: cartCount,
    user: req.session.user || null,
    query: req.query
});

});
// Login
app.get('/login', (req, res) => {
    res.render('login', { error: null, user: null });
});

app.post('/login', (req, res) => {
    const { emailUsername, password } = req.body;
    const user = users.find(u =>
        (u.username === emailUsername || u.email === emailUsername) &&
        u.password === password
    );
    if (user) {
        req.session.user = user;
        res.redirect('/reviews');
    } else {
        res.render('login', { error: "Incorrect email or password.", user: null });
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Register
app.get('/register', (req, res) => {
    res.render('register', { error: null, user: null });
});

app.post('/register', (req, res) => {
    const { fullname, username, email, description, password } = req.body;
    if (!username || !email || !password) {
        return res.render('register', { error: "Missing required fields.", user: null });
    }
    const exists = users.find(u => u.username === username || u.email === email);
    if (exists) {
        return res.render('register', { error: "Username or email already taken.", user: null });
    }
    const newUser = { id: Date.now(), fullname, username, email, description, password };
    users.push(newUser);
    res.redirect('/login');
});

// Cart route
app.use('/cart', cartRouter);

// Wishlist route
app.use('/wishlist', wishlistRouter);

// ===== HOME =====
app.get('/', (req, res) => {
    res.render('index', {
        blogs: blogRouter.blogs || [],
        user: req.session.user || null
    });
});

// ===== DEACTIVATE ACCOUNT =====
app.get('/deactivate-account', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('deactivate-account', { user: req.session.user, error: null });
});

// ===== DELETE ACCOUNT =====
app.get('/delete-account', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('delete-account', { user: req.session.user, error: null });
});

app.post('/deactivate-account', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { deactivatePassword } = req.body;

    // Verify password before deactivating
    const currentUser = users.find(u => u.id === req.session.user.id);
    if (!currentUser || currentUser.password !== deactivatePassword) {
        return res.render('deactivate-account', {
            user: req.session.user,
            error: "Incorrect password. Please try again."
        });
    }

    // Mark account inactive (kept in data, not deleted)
    currentUser.status = "inactive";
    console.log("=> Account deactivated:", currentUser.username);

    // Log out after deactivating
    req.session.destroy();
    res.redirect('/login');
});

app.post('/delete-account', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const deletePassword = req.body.deletePassword;
    const deleteConfirm = req.body["delete-confirm"];

    const currentUser = users.find(u => u.id === req.session.user.id);

    // Check password
    if (!currentUser || currentUser.password !== deletePassword) {
        return res.render('delete-account', {
            user: req.session.user,
            error: "Incorrect password. Please try again."
        });
    }

    // Check the user typed DELETE to confirm
    if (deleteConfirm !== "DELETE") {
        return res.render('delete-account', {
            user: req.session.user,
            error: "Please type DELETE to confirm."
        });
    }

    // Passed all checks - permanently remove the user
    users = users.filter(u => u.id !== req.session.user.id);
    console.log("=> Account deleted:", currentUser.username);

    req.session.destroy();
    res.redirect('/register');
});

// ===== RUN SERVER =====
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});