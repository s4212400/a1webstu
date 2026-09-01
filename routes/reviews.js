const express = require('express');
const router = express.Router();
const Review = require('../models/reviews');
const User = require('../models/user')   // import Review model

// Middleware - only logged-in users may create/edit/delete
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// GET /reviews - show all reviews (list view)
router.get('/', async (req, res) => {
    try {
        // .find() gets all reviews; .populate('author') pulls in the user's info
        // .sort({date: -1}) shows newest first
        const reviews = await Review.find().populate('author').sort({ date: -1 });
        res.render('reviews', { reviews: reviews, user: req.session.user || null });
    } catch (err) {
        console.error(err.message);
        res.redirect('/');
    }
});

// GET /reviews/create - show create form (login required)
router.get('/create', requireLogin, (req, res) => {
    res.render('review-create', { user: req.session.user });
});

// POST /reviews/create - handle new review (login required)
router.post('/create', requireLogin, async (req, res) => {
    const { product, rating, title, description } = req.body;

    // Server-side validation (same as A2)
    let errors = [];
    if (!title || title.trim() === "") {
        errors.push("Review title is required.");
    }
    if (!description || description.trim().length < 10) {
        errors.push("Description must be at least 10 characters.");
    }
    if (!rating) {
        errors.push("Please select a rating.");
    }

    if (errors.length > 0) {
        return res.render('review-create', { user: req.session.user, errors: errors });
    }

    try {
        // Create a new Review document and save it to MongoDB
        const newReview = new Review({
            title: title,
            description: description,
            rating: parseInt(rating),
            image: "/images/ps_controller.jpg",
            author: req.session.user._id   // link to the logged-in user (ObjectId)
        });
        await newReview.save();
        res.redirect('/reviews');
    } catch (err) {
        console.error(err.message);
        res.render('review-create', { user: req.session.user, errors: ["Could not save review."] });
    }
});

// GET /reviews/edit/:id - show edit form (login + owner required)
router.get('/edit/:id', requireLogin, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('author');
        if (!review) {
            return res.redirect('/reviews');
        }
        // Only the author can edit their own review
        // Compare the review's author id with the logged-in user's id
        if (review.author._id.toString() !== req.session.user._id.toString()) {
            return res.redirect('/reviews');
        }
        res.render('review-edit', { review: review, user: req.session.user });
    } catch (err) {
        console.error(err.message);
        res.redirect('/reviews');
    }
});

// POST /reviews/edit/:id - save updated review (login + owner required)
router.post('/edit/:id', requireLogin, async (req, res) => {
    const { rating, title, description } = req.body;
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.redirect('/reviews');
        }
        // Owner check
        if (review.author.toString() !== req.session.user._id.toString()) {
            return res.redirect('/reviews');
        }

        // Server-side validation
        let errors = [];
        if (!title || title.trim() === "") {
            errors.push("Review title is required.");
        }
        if (!description || description.trim().length < 10) {
            errors.push("Description must be at least 10 characters.");
        }
        if (errors.length > 0) {
            return res.render('review-edit', { review: review, user: req.session.user, errors: errors });
        }

        // Update fields and save
        review.title = title;
        review.description = description;
        review.rating = parseInt(rating);
        await review.save();
        res.redirect('/reviews');
    } catch (err) {
        console.error(err.message);
        res.redirect('/reviews');
    }
});

// POST /reviews/delete/:id - delete a review (login + owner, admin can delete any)
router.post('/delete/:id', requireLogin, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.redirect('/reviews');
        }
        // Admin can delete any review; a standard user only their own
        const isOwner = review.author.toString() === req.session.user._id.toString();
        const isAdmin = req.session.user.username === "admin123";
        if (!isOwner && !isAdmin) {
            return res.redirect('/reviews');
        }
        await Review.deleteOne({ _id: req.params.id });
        res.redirect('/reviews');
    } catch (err) {
        console.error(err.message);
        res.redirect('/reviews');
    }
});

// GET /reviews/:id - show one review detail (MUST be last)
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('author');
        if (!review) {
            return res.redirect('/reviews');
        }
        res.render('review-detail', { review: review, user: req.session.user || null });
    } catch (err) {
        console.error(err.message);
        res.redirect('/reviews');
    }
});

module.exports = router;