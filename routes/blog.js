const express = require('express');
const router = express.Router();

let blogs = [
    {
        id: 1724127600001,
        title: "THE RESURGENCE OF RETRO ARCADE",
        author: "admin123",
        date: "2026-08-20",
        category: "RETRO",
        tags: "arcade, nostalgia, pacman",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
        content: "Arcade cabinets are making a massive comeback this year. From neon-lit bars to home setups, the pixelated glory of the 80s is alive and well. In this databank entry, we explore the best ways to emulate these classic systems."
    },
    {
        id: 1724127600002,
        title: "NEXT-GEN HARDWARE LEAKS",
        author: "lgminnn",
        date: "2026-08-18",
        category: "HARDWARE",
        tags: "ps6, xbox, rumors",
        imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
        content: "System scans indicate new hardware specifications have been leaked onto the net. Teraflops are doubling, and haptic feedback is evolving. Are we ready for the next tier of virtual immersion?"
    },
    {
        id: 1724127600003,
        title: "ESPORTS: THE NEW OLYMPICS?",
        author: "Tien Nguyen",
        date: "2026-08-15",
        category: "ESPORTS",
        tags: "tournament, competitive",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
        content: "With prize pools surpassing traditional sports, competitive gaming is no longer a niche. We analyze the latest tournament stats and what it means for the future of digital athletes."
    }
];

// MIDDLEWARE
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next(); 
    } else {
        console.log("=> Unauthorized access attempt blocked!");
        res.redirect('/login'); 
    }
};

router.get('/blog', (req, res) => {
    const searchQuery = req.query.search; 
    const categoryQuery = req.query.category;
    let displayBlogs = blogs; 

    if (categoryQuery && categoryQuery !== 'ALL') {
        displayBlogs = displayBlogs.filter(post => 
            post.category && post.category.toLowerCase() === categoryQuery.toLowerCase()
        );
    }

    if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        displayBlogs = displayBlogs.filter(post => {
            const matchTitle = (post.title || '').toLowerCase().includes(lowerCaseQuery);
            const matchContent = (post.content || '').toLowerCase().includes(lowerCaseQuery);
            return matchTitle || matchContent;
        });
    }

    res.render('blog', { blogs: displayBlogs, user: req.session.user || null, currentCategory: categoryQuery || 'ALL' });
});

router.get('/blog/:id', (req, res) => {
    const blogId = Number(req.params.id); 
    const post = blogs.find(b => b.id === blogId);

    if (!post) {
        return res.status(404).send("<h1>ERROR 404: RECORD NOT FOUND</h1>");
    }
    res.render('blog-detail', { post: post, user: req.session.user || null });
});


// ROUTES Security 

router.get('/blog-create', requireAuth, (req, res) => {
    res.render('blog-create', { user: req.session.user });
});

router.post('/blog-create', requireAuth, (req, res) => {
    const { title, date, category, tags, image, content } = req.body;
    const currentAuthor = req.session.user.username;
    const newPost = {
        id: Date.now(),
        title,
        author: currentAuthor,
        date, category, tags, content,
        imageUrl: image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
    };
    blogs.unshift(newPost);
    console.log("=> Successfully created new blog:", title);
    res.redirect('/blog');
});

router.get('/blog/:id/edit', requireAuth, (req, res) => {
    const blogId = Number(req.params.id);
    const post = blogs.find(b => b.id === blogId);
    if (!post) return res.status(404).send("<h1>ERROR 404: RECORD NOT FOUND</h1>");
    res.render('blog-edit', { post: post, user: req.session.user });
});

router.post('/blog/:id/edit', requireAuth, (req, res) => {
    const blogId = Number(req.params.id);
    const { title, category, image, content } = req.body;
    const postIndex = blogs.findIndex(b => b.id === blogId);
    
    if (postIndex !== -1) {
        blogs[postIndex].title = title;
        blogs[postIndex].category = category;
        blogs[postIndex].imageUrl = image || blogs[postIndex].imageUrl;
        blogs[postIndex].content = content;
    }
    res.redirect('/blog/' + blogId);
});

router.post('/blog/:id/delete', requireAuth, (req, res) => {
    const blogId = Number(req.params.id);
    const postIndex = blogs.findIndex(b => b.id === blogId);
    if (postIndex !== -1) {
        blogs.splice(postIndex, 1); 
    }
    res.redirect('/blog');
});

router.blogs = blogs;
module.exports = router;