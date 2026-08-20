const express = require('express');
const router = express.Router();

// ===== LOGIN PAGE =====
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/login', (req, res) => {
    const { emailUsername, password } = req.body;

    const user = global.users.find(u =>
        (u.username === emailUsername || u.email === emailUsername) &&
        u.password === password
    );
    
    if (user) {
        req.session.user = user;
        console.log("=> Successfully logged in:", user.username);
        req.session.successMessage = `LOGIN SUCCESSFUL! WELCOME BACK, ${user.username}.`;
        res.redirect('/'); 
    } else {
        res.render('login', { error: "Incorrect email or password." });
    }
});

// ===== REGISTER PAGE =====
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

router.post('/register', (req, res) => {
    const { fullname, username, email, description, password } = req.body;
    
    if (!username || !email || !password) {
        return res.render('register', { error: "Missing required fields." });
    }
    
    const exists = global.users.find(u => u.username === username || u.email === email);
    if (exists) {
        return res.render('register', { error: "Username or email already taken." });
    }
    
    const newUser = { id: Date.now(), fullname, username, email, description, password };
    global.users.push(newUser);
    
    req.session.successMessage = "ACCOUNT CREATED SUCCESSFULLY! PLEASE LOG IN.";
    res.redirect('/login');
});

// ===== LOGOUT =====
router.get('/logout', (req, res) => {
    req.session.user = null;
    req.session.errorMessage = "SYSTEM DISCONNECTED. SEE YOU AGAIN!";
    res.redirect('/login');
});

module.exports = router;