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

// Logout
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

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

// Reviews route
// ===== MODULE ROUTES =====
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
        
        console.log("=> Successfully logged in:", user.username);
        
        res.redirect('/'); 
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
    const msg = req.session.successMessage;
    req.session.successMessage = null; 

    res.render('index', {
        blogs: blogRouter.blogs || [],
        user: req.session.user || null,
        successMessage: msg 
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