const express = require('express');
const router = express.Router();

const blogRouter = require('./blog');

// ===== HOME PAGE ROUTE =====
router.get('/', (req, res) => {
    res.render('index', {
        blogs: blogRouter.blogs || [] 
    });
});

module.exports = router;