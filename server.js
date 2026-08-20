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

// Global variables for views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// In-memory users
global.users = [
    {
        id: 1,
        fullname: "Admin Test",
        username: "admin123",
        email: "admin@gmail.com",
        password: "password123",
        description: "I am the admin"
    }
];

// Reviews route
// ===== MODULE ROUTES =====
app.use((req, res, next) => {
    res.locals.successMessage = req.session.successMessage || null;
    req.session.successMessage = null; 
    res.locals.errorMessage = req.session.errorMessage || null;
    req.session.errorMessage = null;
    next();
});
const reviewsRouter = require('./routes/reviews');
app.use('/reviews', reviewsRouter);

// Blog route (teammate)
const blogRouter = require('./routes/blog');
app.use('/', blogRouter);

// Forum route (teammate)
const forumRouter = require('./routes/forum');
app.use('/forum', forumRouter);

// Shop route (teammate)
const shopRouter = require('./routes/shop');
app.locals.products = shopRouter.products;
app.use('/shop', shopRouter);

// Auth route 
const authRouter = require('./routes/auth');
app.use('/', authRouter);

// Cart route
app.use('/cart', cartRouter);

// Wishlist route
app.use('/wishlist', wishlistRouter);

// ===== HOME =====
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

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