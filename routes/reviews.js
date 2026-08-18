const express = require('express');
const router = express.Router();

// In-memory reviews data
let reviews = [
    {
        id: 1,
        title: "Best controller I've owned in a decade",
        excerpt: "The haptic feedback genuinely changes how combat feels...",
        rating: 5,
        reviewer: "Hoang Nguyen",
        date: "Jul 19, 2026",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Great performance, loud fan under heavy load",
        excerpt: "Load times are basically gone compared to my old console...",
        rating: 4,
        reviewer: "Tien Nguyen",
        date: "Jul 15, 2026",
        image: "images/xbox.jpg"
    },
    {
        id: 3,
        title: "OLED screen is a huge upgrade for handheld mode",
        excerpt: "Colors are noticeably richer than the original model...",
        rating: 4,
        reviewer: "Minh Tri",
        date: "Jul 10, 2026",
        image: "images/nintendo_oled.jpg"
    }
];

// GET /reviews - show all reviews
router.get('/', (req, res) => {
    res.render('reviews', { reviews: reviews, user: req.session.user || null });
});

router.get('/create', (req, res) => {
    res.render('review-create', { user: req.session.user || null });
});

// POST /reviews/create - handle new review submission
router.post('/create', (req, res) => {
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

    // If errors, show form again with error messages
    if (errors.length > 0) {
        return res.render('review-create', {
            user: req.session.user || null,
            errors: errors
        });
    }

    // No errors - create the new review
    const newReview = {
        id: Date.now(),
        title: title,
        excerpt: description,
        rating: parseInt(rating),
        reviewer: req.session.user ? req.session.user.fullname : "Guest",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: "images/ps_controller.jpg"
    };

    reviews.push(newReview);

    // Go back to reviews list to see the new review
    res.redirect('/reviews');
});

module.exports = router;