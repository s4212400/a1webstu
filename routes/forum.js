const express = require('express');
const router = express.Router();

// In-memory forum threads 
let threads = [
    {
        id: 1,
        title: "[Rules] Official Ranked Match Settings - Read Before Posting",
        snippet: "Pinning this so new members can check the approved settings for ranked lobbies before they start a dispute thread.",
        author: "ModAdmin",
        date: "Jul 02, 2026",
        replies: 18,
        repliesList: []
    },
    {
        id: 2,
        title: "Best DualSense button remap for fighting games?",
        snippet: "I keep fumbling the special-move inputs with the default layout. What remap are you all using for combos?",
        author: "Hoang Nguyen",
        date: "Jul 20, 2026",
        replies: 7,
        repliesList: [
            { id: 101, author: "Tien Nguyen", content: "I swap L1/R1 to the shoulder triggers and keep the special-move button on the touchpad click.", date: "Jul 20, 2026", deleted: false },
            { id: 102, author: "Minh Tri", content: "Lowering the trigger dead-zone in the accessibility settings helps a lot with quarter circles.", date: "Jul 20, 2026", deleted: false }
        ]
    },
    {
        id: 3,
        title: "Switch OLED vs handheld PC for co-op strategy games",
        snippet: "Trying to decide which is better for couch co-op sessions with friends. Any experiences to share?",
        author: "Minh Tri",
        date: "Jul 15, 2026",
        replies: 4,
        repliesList: []
    }
];

// GET /forum - show all threads
router.get('/', (req, res) => {
    res.render('forum', { threads: threads, user: req.session.user || null });
});

// GET /forum/create - show create thread form
router.get('/create', (req, res) => {
    res.render('forum-create', { user: req.session.user || null });
});

// POST /forum/create - handle new thread
router.post('/create', (req, res) => {
    const { title, snippet } = req.body;

    let errors = [];
    if (!title || title.trim() === "") {
        errors.push("Thread title is required.");
    }
    if (!snippet || snippet.trim().length < 10) {
        errors.push("Thread content must be at least 10 characters.");
    }

    if (errors.length > 0) {
        return res.render('forum-create', { user: req.session.user || null, errors: errors });
    }

    const newThread = {
        id: Date.now(),
        title: title,
        snippet: snippet,
        author: req.session.user ? req.session.user.fullname : "Guest",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        replies: 0,
        repliesList: []
    };

    threads.push(newThread);
    res.redirect('/forum');
});

// GET /forum/edit/:id - show edit form
router.get('/edit/:id', (req, res) => {
    const threadId = parseInt(req.params.id);
    const thread = threads.find(t => t.id === threadId);
    if (!thread) {
        return res.redirect('/forum');
    }
    res.render('forum-edit', { thread: thread, user: req.session.user || null });
});

// POST /forum/edit/:id - save updated thread
router.post('/edit/:id', (req, res) => {
    const threadId = parseInt(req.params.id);
    const { title, snippet } = req.body;

    let errors = [];
    if (!title || title.trim() === "") {
        errors.push("Thread title is required.");
    }
    if (!snippet || snippet.trim().length < 10) {
        errors.push("Content must be at least 10 characters.");
    }

    const thread = threads.find(t => t.id === threadId);
    if (!thread) {
        return res.redirect('/forum');
    }

    if (errors.length > 0) {
        return res.render('forum-edit', { thread: thread, user: req.session.user || null, errors: errors });
    }

    thread.title = title;
    thread.snippet = snippet;
    res.redirect('/forum');
});

// POST /forum/delete/:id - delete a thread
router.post('/delete/:id', (req, res) => {
    const threadId = parseInt(req.params.id);
    threads = threads.filter(t => t.id !== threadId);
    res.redirect('/forum');
});

// POST /forum/:id/reply - add a reply to a thread
router.post('/:id/reply', (req, res) => {
    const threadId = parseInt(req.params.id);
    const { content } = req.body;
    const thread = threads.find(t => t.id === threadId);

    if (thread && content && content.trim() !== "") {
        thread.repliesList.push({
            id: Date.now(),
            author: req.session.user ? req.session.user.fullname : "Guest",
            content: content,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            deleted: false
        });
    }
    res.redirect('/forum/' + threadId);
});

// POST /forum/:id/reply/:replyId/delete - soft-delete a reply (kept for auditing)
router.post('/:id/reply/:replyId/delete', (req, res) => {
    const threadId = parseInt(req.params.id);
    const replyId = parseInt(req.params.replyId);
    const thread = threads.find(t => t.id === threadId);

    if (thread) {
        const reply = thread.repliesList.find(r => r.id === replyId);
        if (reply) {
            reply.deleted = true;  // Soft delete - marked deleted but kept in data
        }
    }
    res.redirect('/forum/' + threadId);
});

// GET /forum/:id - show one thread detail (MUST be last - :id catches everything)
router.get('/:id', (req, res) => {
    const threadId = parseInt(req.params.id);
    const thread = threads.find(t => t.id === threadId);
    if (!thread) {
        return res.redirect('/forum');
    }
    res.render('thread-detail', { thread: thread, user: req.session.user || null });
});

module.exports = router;