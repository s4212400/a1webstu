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

module.exports = router;