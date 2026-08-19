const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session to remember the logged-in user
app.use(session({
    secret: 'consolehaven-secret',
    resave: false,
    saveUninitialized: false
}));

// ===== MOCK DATABASE (shared in-memory data) =====
let users = [
    { id: 1, fullname: "Admin Test", username: "admin123", email: "admin@gmail.com", password: "password123", description: "I am the admin" }
];

// ===== MODULE ROUTES =====
const reviewsRouter = require('./routes/reviews');
app.use('/reviews', reviewsRouter);

const forumRouter = require('./routes/forum');
app.use('/forum', forumRouter);

// New Blog Router
const blogRouter = require('./routes/blog');
app.use('/', blogRouter);

// Cart and Wishlist routes - add back when teammates implement them
// const cartRouter = require('./routes/cart');
// app.use('/cart', cartRouter);
// const wishlistRouter = require('./routes/wishlist');
// app.use('/wishlist', wishlistRouter);

// ===== REGISTER =====
app.get('/register', (req, res) => {
    res.render('register', { error: null, user: req.session.user || null });
});

app.post('/register', (req, res) => {
    const { fullname, username, email, description, password } = req.body;

    if (!username || !email || !password) {
        return res.render('register', { error: "Please fill in all required fields!", user: null });
    }

    const userExists = users.find(u => u.username === username || u.email === email);
    if (userExists) {
        return res.render('register', { error: "Username or Email is already taken!", user: null });
    }

    const newUser = { id: users.length + 1, fullname, username, email, description, password };
    users.push(newUser);
    console.log("=> Successfully registered:", username);

    res.redirect('/login');
});

// ===== LOGIN =====
app.get('/login', (req, res) => {
    res.render('login', { error: null, user: req.session.user || null });
});

app.post('/login', (req, res) => {
    const { emailUsername, password } = req.body;

    const user = users.find(u =>
        (u.username === emailUsername || u.email === emailUsername) && u.password === password
    );

    if (!user) {
        return res.render('login', { error: "Invalid username or password!", user: null });
    }

    req.session.user = user;
    console.log("=> Successfully logged in:", user.username);

    res.redirect('/');
});

// ===== LOGOUT =====
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// ===== HOME =====
app.get('/', (req, res) => {
    res.render('index', { blogs: blogRouter.blogs, user: req.session.user || null });
});

// ===== RUN SERVER =====
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});