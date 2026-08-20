const express = require('express');

const router = express.Router();


// Login required
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();
};


// Profile page
router.get('/', (req, res) => {
    const currentUser = global.users.find(
        user => user.id === req.session.user.id
    );

    if (!currentUser) {
        req.session.destroy();
        return res.redirect('/login');
    }

    res.render('profile', {
        user: currentUser,
        error: null,
        editMode: false
    });
});


// Edit profile page
router.get('/edit', requireLogin, (req, res) => {
    const currentUser = global.users.find(
        user => user.id === req.session.user.id
    );

    if (!currentUser) {
        req.session.destroy();
        return res.redirect('/login');
    }

    res.render('profile', {
        user: currentUser,
        error: null,
        editMode: true
    });
});


// Save profile changes
router.post('/edit', requireLogin, (req, res) => {
    const currentUser = global.users.find(
        user => user.id === req.session.user.id
    );

    if (!currentUser) {
        req.session.destroy();
        return res.redirect('/login');
    }

    const {
        fullname,
        username,
        email,
        description
    } = req.body;


    // Required fields
    if (!fullname || !username || !email) {
        return res.render('profile', {
            user: {
                ...currentUser,
                fullname,
                username,
                email,
                description
            },
            error: 'Full name, username and email are required.',
            editMode: true
        });
    }


    // Check username already used by another account
    const usernameExists = global.users.find(
        user =>
            user.id !== currentUser.id &&
            user.username.toLowerCase() === username.toLowerCase()
    );

    if (usernameExists) {
        return res.render('profile', {
            user: {
                ...currentUser,
                fullname,
                username,
                email,
                description
            },
            error: 'Username is already taken.',
            editMode: true
        });
    }


    // Check email already used by another account
    const emailExists = global.users.find(
        user =>
            user.id !== currentUser.id &&
            user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
        return res.render('profile', {
            user: {
                ...currentUser,
                fullname,
                username,
                email,
                description
            },
            error: 'Email is already registered to another account.',
            editMode: true
        });
    }


    // Update user
    currentUser.fullname = fullname;
    currentUser.username = username;
    currentUser.email = email;
    currentUser.description = description || '';


    // Update session
    req.session.user = currentUser;


    req.session.successMessage = 'PROFILE UPDATED SUCCESSFULLY!';

    res.redirect('/profile');
});


module.exports = router;