const express = require('express');
const router = express.Router();
const Blog = require('../models/blog'); 

// MIDDLEWARE 
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next(); 
    } else {
        console.log("=> Unauthorized access attempt blocked!");
        res.redirect('/login'); 
    }
};

// 1. FILTER CATEGORY & SEARCH 
router.get('/blog', async (req, res) => {
    try {
        const searchQuery = req.query.search; 
        const categoryQuery = req.query.category;
        
        let filter = {};

        if (categoryQuery && categoryQuery !== 'ALL') {
            filter.category = new RegExp('^' + categoryQuery + '$', 'i');
        }

        if (searchQuery) {
            const regex = new RegExp(searchQuery, 'i');
            filter.$or = [
                { title: regex },
                { content: regex },
                { tags: regex }
            ];
        }

        const displayBlogs = await Blog.find(filter).sort({ createdAt: -1 });
        
        res.render('blog', { 
            blogs: displayBlogs, 
            user: req.session.user || null, 
            currentCategory: categoryQuery || 'ALL',
            currentSearch: searchQuery || '' 
        });
    } catch (err) {
        console.error("Error fetching blogs from DB:", err);
        res.status(500).send("<h1>Server Error</h1>");
    }
});

// 2. VIEW A SINGLE BLOG POST 
router.get('/blog/:id', async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);
        if (!post) {
            return res.status(404).send("<h1>ERROR 404: RECORD NOT FOUND</h1>");
        }
        res.render('blog-detail', { post: post, user: req.session.user || null });
    } catch (err) {
        console.error("Error finding blog by ID:", err);
        res.status(404).send("<h1>ERROR 404: RECORD NOT FOUND</h1>");
    }
});

// ROUTES SECURITY
router.get('/blog-create', requireAuth, (req, res) => {
    res.render('blog-create', { user: req.session.user });
});

// 3. CREATE A NEW BLOG POST 
router.post('/blog-create', requireAuth, async (req, res) => {
    try {
        const { title, date, category, tags, image, content } = req.body;
        
        const authorName = req.session.user.username;
        
        await Blog.create({
            title,
            author: authorName, 
            date: date || Date.now(),
            category,
            tags,
            content,
            imageUrl: image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
        });

        console.log("=> Successfully created new blog in MongoDB:", title);
        res.redirect('/blog');
    } catch (err) {
        console.error("Error creating blog:", err);
        
        let cleanMessage = err.message;
        if (err.errors) {
            const firstField = Object.keys(err.errors)[0];
            cleanMessage = err.errors[firstField].message;
        }

        res.status(400).render('blog-create', { 
            user: req.session.user, 
            error: cleanMessage 
        });
    }
});

// 4. EDIT A BLOG POST (Load edit page)
router.get('/blog/:id/edit', requireAuth, async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);
        if (!post) return res.status(404).send("<h1>ERROR 404: RECORD NOT FOUND</h1>");
        res.render('blog-edit', { post: post, user: req.session.user });
    } catch (err) {
        console.error("Error loading edit page:", err);
        res.status(404).send("<h1>ERROR 404: RECORD NOT FOUND</h1>");
    }
});

// 5. UPDATE A BLOG POST (Save changes to Database)
router.post('/blog/:id/edit', requireAuth, async (req, res) => {
    try {
        const { title, category, image, content, tags } = req.body; 
        
        const updateData = {
            title,
            category,
            content,
            tags
        };
        if (image) {
            updateData.imageUrl = image;
        }

        await Blog.findByIdAndUpdate(req.params.id, updateData);
        console.log("=> Successfully updated blog ID:", req.params.id);
        res.redirect('/blog/' + req.params.id);
    } catch (err) {
        console.error("Error updating blog:", err);
        res.status(500).send("<h1>Error updating blog</h1>");
    }
});

// 6. DELETE A BLOG POST
router.post('/blog/:id/delete', requireAuth, async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        console.log("=> Successfully deleted blog ID:", req.params.id);
        res.redirect('/blog');
    } catch (err) {
        console.error("Error deleting blog:", err);
        res.status(500).send("<h1>Error deleting blog</h1>");
    }
});

module.exports = router;