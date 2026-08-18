const express = require('express');
const session = require('express-session');
const path = require('path');
const cartRouter = require('./routes/cart');

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

// ==========================================
// WISHLIST
// ==========================================

app.get('/wishlist', (req, res) => {

    res.render('wishlist', {
        wishlist: wishlist,
        user: req.session.user || null
    });

});


// Move to Cart
app.get('/wishlist/move/:id', (req, res) => {

    const id = Number(req.params.id);

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

    const cart = req.app.locals.cart;

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

    res.redirect('/wishlist');
});


// ==========================================
// MARK PURCHASED
// ==========================================

app.get('/wishlist/purchase/:id', (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(item => item.id === id);

    if (!item) {
        return res.redirect('/wishlist');
    }

    item.isPurchased = true;

    res.redirect('/wishlist');

});


// ==========================================
// MARK UNPURCHASED
// ==========================================

app.get('/wishlist/unpurchase/:id', (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(item => item.id === id);

    if (!item) {
        return res.redirect('/wishlist');
    }

    item.isPurchased = false;

    res.redirect('/wishlist');

});


// ==========================================
// REMOVE FROM WISHLIST
// ==========================================

app.get('/wishlist/remove/:id', (req, res) => {

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

// In-memory wishlist
let wishlist = [
    {
        id: 1,
        name: "The Legend of Zelda: Tears of the Kingdom",
        platform: "Nintendo Switch",
        genre: "Action-Adventure",
        image: "/images/zelda_totk.jpg",
        productPage: "/product-zelda.html",
        oldPrice: 69.99,
        newPrice: 54.99,
        discount: 20,
        rating: "⭐⭐⭐⭐⭐",
        ratingCount: "2,481 reviews",
        stock: "In Stock",
        stockClass: "in-stock",
        usersWishlisted: 1204,
        addedToCart: 876,
        purchasedCount: 512,
        addedDate: "12 July 2026",
        isPurchased: false
    },

    {
        id: 2,
        name: "Super Mario Bros Wonder",
        platform: "Nintendo Switch",
        genre: "Platformer",
        image: "/images/mario.jpg",
        productPage: "/product-mario.html",
        oldPrice: 59.99,
        newPrice: 44.99,
        discount: 25,
        rating: "⭐⭐⭐⭐⭐",
        ratingCount: "1,932 reviews",
        stock: "In Stock",
        stockClass: "in-stock",
        usersWishlisted: 958,
        addedToCart: 640,
        purchasedCount: 389,
        addedDate: "08 July 2026",
        isPurchased: false
    },

    {
        id: 3,
        name: "Marvel's Spider-Man 2",
        platform: "PlayStation 5",
        genre: "Action",
        image: "/images/spiderman2.jpg",
        productPage: "/product-spiderman.html",
        oldPrice: 69.99,
        newPrice: 49.99,
        discount: 30,
        rating: "⭐⭐⭐⭐⭐",
        ratingCount: "3,107 reviews",
        stock: "Low Stock",
        stockClass: "low-stock",
        usersWishlisted: 1540,
        addedToCart: 1102,
        purchasedCount: 734,
        addedDate: "02 July 2026",
        isPurchased: true
    },

    {
        id: 4,
        name: "Elden Ring",
        platform: "PS5",
        genre: "Souls-like RPG",
        image: "/images/eldenring.jpg",
        productPage: "/product-eldenring.html",
        oldPrice: 59.99,
        newPrice: 39.99,
        discount: 35,
        rating: "⭐⭐⭐⭐⭐",
        ratingCount: "4,265 reviews",
        stock: "Out of Stock",
        stockClass: "out-stock",
        usersWishlisted: 2876,
        addedToCart: 1981,
        purchasedCount: 1455,
        addedDate: "28 June 2026",
        isPurchased: false
    }
];

app.locals.wishlist = wishlist;

// Reviews route
const reviewsRouter = require('./routes/reviews');
app.use('/reviews', reviewsRouter);

// Blog route (teammate)
const blogRouter = require('./routes/blog');
app.use('/blog', blogRouter);

// Forum route (teammate)
const forumRouter = require('./routes/forum');
app.use('/forum', forumRouter);

// Home
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user || null });
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
// Cart
app.use('/cart', cartRouter);


// Wishlist
app.get('/wishlist', (req, res) => {
    res.render('wishlist', {
        wishlist: wishlist,
        user: req.session.user || null
    });
});

// Move to Cart
app.get('/wishlist/move/:id', (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(item => item.id === id);

    if (!item) {
        return res.redirect('/wishlist');
    }

    // Cannot move purchased item
    if (item.isPurchased) {
        return res.redirect('/wishlist');
    }

    // Cannot move out-of-stock item
    if (item.stock === 'Out of Stock') {
        return res.redirect('/wishlist');
    }

    // Increase cart count
    item.addedToCart++;

    res.redirect('/wishlist');
});


// Mark Purchased
app.get('/wishlist/purchase/:id', (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(item => item.id === id);

    if (!item) {
        return res.redirect('/wishlist');
    }

    item.isPurchased = true;

    res.redirect('/wishlist');
});


// Mark Unpurchased
app.get('/wishlist/unpurchase/:id', (req, res) => {

    const id = Number(req.params.id);

    const item = wishlist.find(item => item.id === id);

    if (!item) {
        return res.redirect('/wishlist');
    }

    item.isPurchased = false;

    res.redirect('/wishlist');
});


// Remove from Wishlist
app.get('/wishlist/remove/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = wishlist.findIndex(item => item.id === id);

    if (index === -1) {
        return res.redirect('/wishlist');
    }

    wishlist.splice(index, 1);

    res.redirect('/wishlist');
});

// Run server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});