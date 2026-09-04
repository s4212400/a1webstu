const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

// ===== HOME PAGE ROUTE =====
router.get('/', async (req, res) => {
    let activeBlogs = [];
    try {
        // Get the 3 most recent blog posts from MongoDB for the homepage
        activeBlogs = await Blog.find().sort({ date: -1 }).limit(3);
    } catch (err) {
        console.error("Error loading blogs for homepage:", err.message);
        activeBlogs = [];   // homepage still renders even if blogs fail
    }

    res.render('index', { blogs: activeBlogs });
});

module.exports = router;