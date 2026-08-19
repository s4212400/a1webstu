const express = require('express');
const router = express.Router();

// In-memory reviews data (temporary store for A2)
let reviews = [
    {
        id: 1,
        title: "Best controller I've owned in a decade",
        excerpt: "The haptic feedback genuinely changes how combat feels...",
        rating: 5,
        reviewer: "Hoang Nguyen",
        date: "Jul 19, 2026",
        image: "/images/ps_controller.jpg"
    },
    {
        id: 2,
        title: "Great performance, loud fan under heavy load",
        excerpt: "Load times are basically gone compared to my old console...",
        rating: 4,
        reviewer: "Tien Nguyen",
        date: "Jul 15, 2026",
        image: "/images/xbox.jpg"
    },
    {
        id: 3,
        title: "OLED screen is a huge upgrade for handheld mode",
        excerpt: "Colors are noticeably richer than the original model...",
        rating: 4,
        reviewer: "Minh Tri",
        date: "Jul 10, 2026",
        image: "/images/nintendo_oled.jpg"
    },
    {
        id: 4,
        title: "Solid all-round console for the price point",
        excerpt: "Been using this as my main setup for a month now and it handles everything I throw at it without issues.",
        rating: 5,
        reviewer: "Admin Test",
        date: "Jul 22, 2026",
        image: "/images/ps5.jpg"
    }
];

// Middleware - only logged-in users may create/edit/delete
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// GET /reviews - show all reviews
router.get('/', (req, res) => {
    res.render('reviews', { reviews: reviews, user: req.session.user || null });
});

// GET /reviews/create - show create form (login required)
router.get('/create', requireLogin, (req, res) => {
    res.render('review-create', { user: req.session.user });
});

// POST /reviews/create - handle new review (login required)
router.post('/create', requireLogin, (req, res) => {
    const { product, rating, title, description } = req.body;

    // Server-side validation
    let errors = [];
    if (!title || title.trim() === "") {
        errors.push("Review title is required.");
    }
    if (!description || description.trim().length < 10) {
        errors.push("Description must be at least 10 characters.");
    }
    if (!product) {
        errors.push("Please select a product.");
    }
    if (!rating) {
        errors.push("Please select a rating.");
    }

    if (errors.length > 0) {
        return res.render('review-create', { user: req.session.user, errors: errors });
    }

    const newReview = {
        id: Date.now(),
        title: title,
        excerpt: description,
        rating: parseInt(rating),
        reviewer: req.session.user.fullname,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: "/images/ps_controller.jpg"
    };

    reviews.push(newReview);
    res.redirect('/reviews');
});

// GET /reviews/edit/:id - show edit form (login + owner required)
router.get('/edit/:id', requireLogin, (req, res) => {
    const reviewId = parseInt(req.params.id);
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
        return res.redirect('/reviews');
    }

    // Only the author can edit their own review
    if (review.reviewer !== req.session.user.fullname) {
        return res.redirect('/reviews');
    }

    res.render('review-edit', { review: review, user: req.session.user });
});

// POST /reviews/edit/:id - save updated review (login + owner required)
router.post('/edit/:id', requireLogin, (req, res) => {
    const reviewId = parseInt(req.params.id);
    const { product, rating, title, description } = req.body;

    const review = reviews.find(r => r.id === reviewId);
    if (!review) {
        return res.redirect('/reviews');
    }

    // Only the author can edit their own review
    if (review.reviewer !== req.session.user.fullname) {
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

    review.title = title;
    review.excerpt = description;
    review.rating = parseInt(rating);

    res.redirect('/reviews');
});

// POST /reviews/delete/:id - delete a review (login + owner required)
router.post('/delete/:id', requireLogin, (req, res) => {
    const reviewId = parseInt(req.params.id);
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
        return res.redirect('/reviews');
    }

    // Only the author can delete their own review
    if (review.reviewer !== req.session.user.fullname) {
        return res.redirect('/reviews');
    }

    reviews = reviews.filter(r => r.id !== reviewId);
    res.redirect('/reviews');
});

// GET /reviews/:id - show one review detail (MUST be last - :id catches everything)
router.get('/:id', (req, res) => {
    const reviewId = parseInt(req.params.id);
    const review = reviews.find(r => r.id === reviewId);

    if (!review) {
        return res.redirect('/reviews');
    }

    res.render('review-detail', { review: review, user: req.session.user || null });
});

module.exports = router;