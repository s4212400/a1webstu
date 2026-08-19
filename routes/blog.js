const express = require('express');
const router = express.Router();

let blogs = [];

router.get('/blog', (req, res) => {
    const searchQuery = req.query.search; 
    let displayBlogs = blogs; 

    if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        
        displayBlogs = blogs.filter(post => {
            const matchTitle = (post.title || '').toLowerCase().includes(lowerCaseQuery);
            const matchContent = (post.content || '').toLowerCase().includes(lowerCaseQuery);
            
            return matchTitle || matchContent;
        });
    }

    res.render('blog', { blogs: displayBlogs, user: req.session.user || null });
});

router.get('/blog-create', (req, res) => {
    res.render('blog-create', { user: req.session.user || null });
});

router.post('/blog-create', (req, res) => {
    const { title, author, date, category, tags, image, content } = req.body;

    const newPost = {
        id: Date.now(),
        title,
        author,
        date,
        category,
        tags,
        content,
        imageUrl: image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
    };

    blogs.unshift(newPost);
    console.log("=> Successfully created new blog:", title);

    res.redirect('/blog');
});

router.get('/blog/:id', (req, res) => {
    const blogId = Number(req.params.id); 

    const post = blogs.find(b => b.id === blogId);

    if (!post) {
        return res.status(404).send("<h1>ERROR 404: RECORD NOT FOUND</h1>");
    }

    res.render('blog-detail', { post: post, user: req.session.user || null });
});

router.blogs = blogs;

module.exports = router;