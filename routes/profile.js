const express = require('express');
const User = require('../models/user');

const router = express.Router();


// Login required
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    next();
};


// Profile page
router.get('/', requireLogin, async (req, res) => {
    try {

        const currentUser = await User.findById(
            req.session.user._id
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

    } catch (error) {

        console.error(
            'Error loading profile:',
            error.message
        );

        res.status(500).send(
            'Unable to load profile.'
        );
    }
});


// Edit profile page
router.get('/edit', requireLogin, async (req, res) => {
    try {

        const currentUser = await User.findById(
            req.session.user._id
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

    } catch (error) {

        console.error(
            'Error loading edit profile:',
            error.message
        );

        res.status(500).send(
            'Unable to load profile.'
        );
    }
});


// Save profile changes
router.post('/edit', requireLogin, async (req, res) => {
    try {

        const currentUser = await User.findById(
            req.session.user._id
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
                    ...currentUser.toObject(),
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
        const usernameExists = await User.findOne({
            username: {
                $regex: `^${username}$`,
                $options: 'i'
            },
            _id: {
                $ne: currentUser._id
            }
        });

        if (usernameExists) {

            return res.render('profile', {
                user: {
                    ...currentUser.toObject(),
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
        const emailExists = await User.findOne({
            email: {
                $regex: `^${email}$`,
                $options: 'i'
            },
            _id: {
                $ne: currentUser._id
            }
        });

        if (emailExists) {

            return res.render('profile', {
                user: {
                    ...currentUser.toObject(),
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


        // Save changes to MongoDB
        await currentUser.save();


        // Update session
        req.session.user = currentUser;


        req.session.successMessage =
            'PROFILE UPDATED SUCCESSFULLY!';

        res.redirect('/profile');

    } catch (error) {

        console.error(
            'Error updating profile:',
            error.message
        );

        res.status(500).send(
            'Unable to update profile.'
        );
    }
});


module.exports = router;