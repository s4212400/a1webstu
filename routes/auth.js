const express = require('express');
const router = express.Router();
const User = require('../models/user');   // đổi 'user' cho khớp tên file model của cậu

// ===== LOGIN PAGE =====
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
    const { emailUsername, password } = req.body;
    try {
        // Find the user in MongoDB by username OR email
        const user = await User.findOne({
            $or: [{ username: emailUsername }, { email: emailUsername }]
        });

        // No user found
        if (!user) {
            return res.render('login', { error: "Incorrect email or password." });
        }

        // Block locked accounts
        if (user.status === "locked") {
            return res.render('login', { error: "Your account has been locked. Please contact an administrator." });
        }

        // Check the password against the stored hash (bcrypt)
        const match = await user.comparePassword(password);
        if (!match) {
            return res.render('login', { error: "Incorrect email or password." });
        }

        // Login OK - store user in session (as a plain object)
        req.session.user = user;
        console.log("=> Successfully logged in:", user.username);
        req.session.successMessage = `LOGIN SUCCESSFUL! WELCOME BACK, ${user.username}.`;
        res.redirect('/');
    } catch (err) {
        console.error(err.message);
        res.render('login', { error: "Something went wrong. Please try again." });
    }
});

// ===== REGISTER PAGE =====
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
    const { fullname, username, email, description, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.render('register', { error: "Missing required fields." });
    }

    try {
        // Check for existing username or email (unique constraint)
        const exists = await User.findOne({
            $or: [{ username: username }, { email: email }]
        });
        if (exists) {
            return res.render('register', { error: "Username or email already taken." });
        }

        // Create new user - the model hashes the password automatically on save
        const newUser = new User({
            fullname,
            username,
            email,
            description,
            password,           // will be hashed by the pre-save hook
            role: "standard",
            status: "active"
        });
        await newUser.save();

        req.session.successMessage = "ACCOUNT CREATED SUCCESSFULLY! PLEASE LOG IN.";
        res.redirect('/login');
    } catch (err) {
        console.error(err.message);
        res.render('register', { error: "Could not create account. Please try again." });
    }
});

// ===== LOGOUT =====
router.get('/logout', (req, res) => {
    req.session.user = null;
    req.session.errorMessage = "SYSTEM DISCONNECTED. SEE YOU AGAIN!";
    res.redirect('/login');
});

module.exports = router;