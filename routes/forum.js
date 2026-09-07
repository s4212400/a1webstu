const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Middleware - only logged-in users may create/edit/delete/reply
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// GET /forum - show all threads (supports ?search= and ?sort=)
router.get('/', async (req, res) => {
    try {
        const { search, sort } = req.query;

        // Only show root threads that haven't been soft-deleted
        let filter = { parentThread: null, deleted: false };

        // Filter by thread title OR post content (per brief)
        if (search && search.trim() !== '') {
            const regex = new RegExp(search.trim(), 'i');
            filter.$or = [{ title: regex }, { content: regex }];
        }

        // Map the dropdown value to a real Mongoose sort object
        let sortOption = { lastActivityAt: -1 }; // default: most recent post first
        if (sort === 'title-asc') sortOption = { title: 1 };
        else if (sort === 'title-desc') sortOption = { title: -1 };
        else if (sort === 'oldest-reply') sortOption = { lastActivityAt: 1 };
        else if (sort === 'newest-reply') sortOption = { lastActivityAt: -1 };

        const threadDocs = await Post.find(filter).populate('author').sort(sortOption);

        // Attach a live reply count to each thread (only counting non-deleted replies)
        const threads = await Promise.all(threadDocs.map(async (t) => {
            const replyCount = await Post.countDocuments({ parentThread: t._id, deleted: false });
            const obj = t.toObject();
            obj.replyCount = replyCount;
            return obj;
        }));

        res.render('forum', {
            threads: threads,
            user: req.session.user || null,
            currentSearch: search || '',
            currentSort: sort || 'newest-reply'
        });
    } catch (err) {
        console.error(err.message);
        res.redirect('/');
    }
});

// GET /forum/create - show create thread form (login required)
router.get('/create', requireLogin, (req, res) => {
    res.render('forum-create', { user: req.session.user, errors: null });
});

// POST /forum/create - handle new thread (login required)
router.post('/create', requireLogin, async (req, res) => {
    const { title, content, imageUrl } = req.body;

    let errors = [];
    if (!title || title.trim() === '') {
        errors.push('Thread title is required.');
    }
    if (!content || content.trim().length < 10) {
        errors.push('Thread content must be at least 10 characters.');
    }

    if (errors.length > 0) {
        return res.render('forum-create', { user: req.session.user, errors: errors });
    }

    try {
        await Post.create({
            title: title,
            content: content,
            imageUrl: imageUrl || '',
            author: req.session.user._id,
            parentThread: null,
            lastActivityAt: new Date()
        });
        res.redirect('/forum');
    } catch (err) {
        console.error(err.message);
        res.render('forum-create', { user: req.session.user, errors: ['Could not create thread.'] });
    }
});

// GET /forum/edit/:id - show edit form (login + owner required)
router.get('/edit/:id', requireLogin, async (req, res) => {
    try {
        const thread = await Post.findById(req.params.id);
        if (!thread || thread.deleted) {
            return res.redirect('/forum');
        }
        if (thread.author.toString() !== req.session.user._id.toString()) {
            return res.redirect('/forum');
        }
        res.render('forum-edit', { thread: thread, user: req.session.user, errors: null });
    } catch (err) {
        console.error(err.message);
        res.redirect('/forum');
    }
});

// POST /forum/edit/:id - save updated thread (login + owner required)
router.post('/edit/:id', requireLogin, async (req, res) => {
    const { title, content, imageUrl } = req.body;
    try {
        const thread = await Post.findById(req.params.id);
        if (!thread || thread.deleted) {
            return res.redirect('/forum');
        }
        if (thread.author.toString() !== req.session.user._id.toString()) {
            return res.redirect('/forum');
        }

        let errors = [];
        if (!title || title.trim() === '') {
            errors.push('Thread title is required.');
        }
        if (!content || content.trim().length < 10) {
            errors.push('Content must be at least 10 characters.');
        }

        if (errors.length > 0) {
            return res.render('forum-edit', { thread: thread, user: req.session.user, errors: errors });
        }

        thread.title = title;
        thread.content = content;
        if (imageUrl) thread.imageUrl = imageUrl;
        await thread.save();
        res.redirect('/forum/' + thread._id);
    } catch (err) {
        console.error(err.message);
        res.redirect('/forum');
    }
});

// POST /forum/delete/:id - soft-delete a thread (login + owner/admin required)
router.post('/delete/:id', requireLogin, async (req, res) => {
    try {
        const thread = await Post.findById(req.params.id);
        if (!thread) {
            return res.redirect('/forum');
        }
        const isOwner = thread.author.toString() === req.session.user._id.toString();
        const isAdmin = req.session.user.username === 'admin123';
        if (!isOwner && !isAdmin) {
            return res.redirect('/forum');
        }
        thread.deleted = true; // soft delete - kept in DB for auditing
        await thread.save();
        res.redirect('/forum');
    } catch (err) {
        console.error(err.message);
        res.redirect('/forum');
    }
});

// POST /forum/:id/reply - add a reply (login required)
router.post('/:id/reply', requireLogin, async (req, res) => {
    const threadId = req.params.id;
    const { content, imageUrl } = req.body;
    try {
        const thread = await Post.findById(threadId);
        if (!thread || thread.deleted) {
            return res.redirect('/forum');
        }

        if (content && content.trim() !== '') {
            await Post.create({
                content: content,
                imageUrl: imageUrl || '',
                author: req.session.user._id,
                parentThread: thread._id
            });
            thread.lastActivityAt = new Date();
            await thread.save();
        }
        res.redirect('/forum/' + threadId);
    } catch (err) {
        console.error(err.message);
        res.redirect('/forum');
    }
});

// POST /forum/:id/reply/:replyId/delete - soft-delete a reply (login + owner required)
router.post('/:id/reply/:replyId/delete', requireLogin, async (req, res) => {
    try {
        const reply = await Post.findById(req.params.replyId);
        if (reply && reply.author.toString() === req.session.user._id.toString()) {
            reply.deleted = true; // soft delete - kept in DB for auditing
            await reply.save();
        }
        res.redirect('/forum/' + req.params.id);
    } catch (err) {
        console.error(err.message);
        res.redirect('/forum');
    }
});

// GET /forum/:id - show one thread + its replies (MUST be last)
router.get('/:id', async (req, res) => {
    try {
        const thread = await Post.findById(req.params.id).populate('author');
        if (!thread || thread.deleted) {
            return res.redirect('/forum');
        }

        const replies = await Post.find({ parentThread: thread._id })
            .populate('author')
            .sort({ createdAt: 1 });

        res.render('thread-detail', {
            thread: thread,
            replies: replies,
            user: req.session.user || null
        });
    } catch (err) {
        console.error(err.message);
        res.redirect('/forum');
    }
});

module.exports = router;
