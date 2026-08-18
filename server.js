const express = require('express');
const session = require('express-session');
const path = require('path');

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

// Reviews route
const reviewsRouter = require('./routes/reviews');
app.use('/reviews', reviewsRouter);

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

// Run server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});