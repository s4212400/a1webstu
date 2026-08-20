const express = require('express');
const router = express.Router();

const blogRouter = require('./blog');

// ===== HOME PAGE ROUTE =====
router.get('/', (req, res) => {
    let activeBlogs = blogRouter.blogs || [];

    if (activeBlogs.length === 0) {
        activeBlogs = demoBlogs;
    }

    res.render('index', {
        blogs: activeBlogs 
    });
});

module.exports = router;