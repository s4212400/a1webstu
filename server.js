require('dotenv').config();
const { dbconnect } = require('./config/db');
dbconnect(process.env.MONGODB_URI);
const express = require('express');
const session = require('express-session');
const path = require('path');
const cartRouter = require('./routes/cart');
const wishlistRouter = require('./routes/wishlist');
const profileRouter = require('./routes/profile');
const User = require('./models/user');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


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
        description: "I am the admin",
        role: "admin",
        status: "active",
        joined: "Mar 15, 2026"
    },
    {
        id: 2,
        fullname: "Sarah Player",
        username: "SarahPlayer",
        email: "sarah@email.com",
        password: "password123",
        description: "",
        role: "moderator",
        status: "active",
        joined: "Apr 02, 2026"
    },
    {
        id: 3,
        fullname: "Mike Console",
        username: "MikeConsole",
        email: "mike@email.com",
        password: "password123",
        description: "",
        role: "standard",
        status: "active",
        joined: "May 10, 2026"
    },
    {
        id: 4,
        fullname: "Emma Games",
        username: "EmmaGames",
        email: "emma@email.com",
        password: "password123",
        description: "",
        role: "standard",
        status: "locked",
        joined: "Jun 01, 2026"
    }
];

// ===== MODULE ROUTES =====
app.use((req, res, next) => {
    res.locals.successMessage = req.session.successMessage || null;
    req.session.successMessage = null; 
    res.locals.errorMessage = req.session.errorMessage || null;
    req.session.errorMessage = null;
    next();
});

// Review route
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

// Product detail route (dynamic - uses shared product data)
const productRouter = require('./routes/product');
app.use('/product', productRouter);

// Admin dashboard route (admin account only)
const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

// Auth route 
const authRouter = require('./routes/auth');
app.use('/', authRouter);

// Cart route
app.use('/cart', cartRouter);

// Wishlist route
app.use('/wishlist', wishlistRouter);

// Profile route
app.use('/profile', profileRouter);

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

app.post('/deactivate-account', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const { deactivatePassword } = req.body;
    try {
        // Find the current user in MongoDB
        const currentUser = await User.findById(req.session.user._id);
 
        // Verify password using bcrypt (comparePassword)
        const match = currentUser ? await currentUser.comparePassword(deactivatePassword) : false;
        if (!match) {
            return res.render('deactivate-account', {
                user: req.session.user,
                error: "Incorrect password. Please try again."
            });
        }
 // Mark account inactive (kept in DB, not deleted)
        currentUser.status = "inactive";
        await currentUser.save();
        console.log("=> Account deactivated:", currentUser.username);
 
        req.session.destroy();
        res.redirect('/login');
    } catch (err) {
        console.error(err.message);
        res.render('deactivate-account', { user: req.session.user, error: "Something went wrong." });
    }
});

// ===== DELETE ACCOUNT =====
app.get('/delete-account', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('delete-account', { user: req.session.user, error: null });
});
 
app.post('/delete-account', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const deletePassword = req.body.deletePassword;
    const deleteConfirm = req.body["delete-confirm"];
    try {
        const currentUser = await User.findById(req.session.user._id);
 
        // Verify password
        const match = currentUser ? await currentUser.comparePassword(deletePassword) : false;
        if (!match) {
            return res.render('delete-account', {
                user: req.session.user,
                error: "Incorrect password. Please try again."
            });
        }
 
        // Require typing DELETE to confirm
        if (deleteConfirm !== "DELETE") {
            return res.render('delete-account', {
                user: req.session.user,
                error: "Please type DELETE to confirm."
            });
        }
 
        // Permanently remove the user from MongoDB
        await User.deleteOne({ _id: req.session.user._id });
        console.log("=> Account deleted:", currentUser.username);
 
        req.session.destroy();
        res.redirect('/register');
    } catch (err) {
        console.error(err.message);
        res.render('delete-account', { user: req.session.user, error: "Something went wrong." });
    }
});

// ===== PASSWORD RESET (simulated - no real email in this prototype) =====
app.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { user: req.session.user || null, error: null });
});
 
app.post('/forgot-password', (req, res) => {
    const { resetEmail } = req.body;
 
    // Basic validation - email must be provided
    if (!resetEmail || resetEmail.trim() === "") {
        return res.render('forgot-password', {
            user: req.session.user || null,
            error: "Please enter your email address."
        });
    }
 
    // For security, we always show the same confirmation page whether or not
    // the email exists (prevents attackers probing which emails are registered).
    // A real system would email a reset token here; this prototype simulates it.
    res.redirect('/reset-sent');
});
 
app.get('/reset-sent', (req, res) => {
    res.render('reset-sent', { user: req.session.user || null });
});

// ===== STATIC PAGES =====
app.get('/sitemap', (req, res) => {
    res.render('sitemap', { user: req.session.user || null });
});
 
app.get('/policy', (req, res) => {
    res.render('policy', { user: req.session.user || null });
});

// ===== RUN SERVER =====
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});