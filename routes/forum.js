const express = require('express');
const router = express.Router();

// Middleware - only logged-in users may create/edit/delete/reply
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// In-memory forum threads 
let threads = [
    {
        id: 1,
        title: "[Rules] Official Ranked Match Settings - Read Before Posting",
        snippet: "Pinning this so new members can check the approved settings for ranked lobbies before they start a dispute thread. Please read fully before posting a complaint.",
        author: "Admin Test",
        date: "Jul 02, 2026",
        replies: 4,
        repliesList: [
            { id: 1001, author: "Hoang Nguyen", content: "Thanks for pinning this, saved me from starting a duplicate thread.", date: "Jul 03, 2026", deleted: false },
            { id: 1002, author: "Tien Nguyen", content: "Can we get the turbo-button rule clarified? It is still ambiguous for fighting games.", date: "Jul 04, 2026", deleted: false },
            { id: 1003, author: "Minh Tri", content: "Agreed, the macro rule needs an example. Otherwise great writeup.", date: "Jul 05, 2026", deleted: false },
            { id: 1004, author: "Admin Test", content: "Updated the post with a turbo-button example. Let me know if anything is still unclear.", date: "Jul 06, 2026", deleted: false }
        ]
    },
    {
        id: 2,
        title: "Best DualSense button remap for fighting games?",
        snippet: "I keep fumbling the special-move inputs with the default layout. What remap are you all using for combos?",
        author: "Hoang Nguyen",
        date: "Jul 20, 2026",
        replies: 5,
        repliesList: [
            { id: 2001, author: "Tien Nguyen", content: "I swap L1/R1 to the shoulder triggers and keep the special-move button on the touchpad click.", date: "Jul 20, 2026", deleted: false },
            { id: 2002, author: "Minh Tri", content: "Lowering the trigger dead-zone in the accessibility settings helps a lot with quarter circles.", date: "Jul 20, 2026", deleted: false },
            { id: 2003, author: "Admin Test", content: "Touchpad-click for supers is underrated. Been using it for months without issues.", date: "Jul 21, 2026", deleted: false },
            { id: 2004, author: "ModAdmin", content: "Reminder: remaps are allowed in ranked as long as you don't use turbo. See the rules thread.", date: "Jul 21, 2026", deleted: false },
            { id: 2005, author: "Tien Nguyen", content: "Good point, updated my layout to stay compliant. Thanks!", date: "Jul 22, 2026", deleted: false }
        ]
    },
    {
        id: 3,
        title: "Switch OLED vs handheld PC for co-op strategy games",
        snippet: "Trying to decide which is better for couch co-op sessions with friends. Any experiences to share?",
        author: "Minh Tri",
        date: "Jul 15, 2026",
        replies: 3,
        repliesList: [
            { id: 3001, author: "Hoang Nguyen", content: "OLED wins for pure couch co-op — the kickstand and detachable joycons make it effortless.", date: "Jul 15, 2026", deleted: false },
            { id: 3002, author: "Admin Test", content: "Handheld PC is more flexible but battery life tanks with two controllers connected.", date: "Jul 16, 2026", deleted: false },
            { id: 3003, author: "Tien Nguyen", content: "If you already own a dock, the OLED is the easier recommendation for guests.", date: "Jul 16, 2026", deleted: false }
        ]
    }
];

// GET /forum - show all threads
router.get('/', (req, res) => {
    res.render('forum', { threads: threads, user: req.session.user || null });
});

// GET /forum/create - show create thread form (login required)
router.get('/create', requireLogin, (req, res) => {
    res.render('forum-create', { user: req.session.user });
});

// POST /forum/create - handle new thread (login required)
router.post('/create', requireLogin, (req, res) => {
    const { title, snippet } = req.body;

    let errors = [];
    if (!title || title.trim() === "") {
        errors.push("Thread title is required.");
    }
    if (!snippet || snippet.trim().length < 10) {
        errors.push("Thread content must be at least 10 characters.");
    }

    if (errors.length > 0) {
        return res.render('forum-create', { user: req.session.user, errors: errors });
    }

    const newThread = {
        id: Date.now(),
        title: title,
        snippet: snippet,
        author: req.session.user.fullname,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        replies: 0,
        repliesList: []
    };

    threads.push(newThread);
    res.redirect('/forum');
});

// GET /forum/edit/:id - show edit form (login + owner required)
router.get('/edit/:id', requireLogin, (req, res) => {
    const threadId = parseInt(req.params.id);
    const thread = threads.find(t => t.id === threadId);
    if (!thread) {
        return res.redirect('/forum');
    }
    if (thread.author !== req.session.user.fullname) {
        return res.redirect('/forum');
    }
    res.render('forum-edit', { thread: thread, user: req.session.user });
});

// POST /forum/edit/:id - save updated thread (login + owner required)
router.post('/edit/:id', requireLogin, (req, res) => {
    const threadId = parseInt(req.params.id);
    const { title, snippet } = req.body;

    const thread = threads.find(t => t.id === threadId);
    if (!thread) {
        return res.redirect('/forum');
    }
    if (thread.author !== req.session.user.fullname) {
        return res.redirect('/forum');
    }

    let errors = [];
    if (!title || title.trim() === "") {
        errors.push("Thread title is required.");
    }
    if (!snippet || snippet.trim().length < 10) {
        errors.push("Content must be at least 10 characters.");
    }

    if (errors.length > 0) {
        return res.render('forum-edit', { thread: thread, user: req.session.user, errors: errors });
    }

    thread.title = title;
    thread.snippet = snippet;
    res.redirect('/forum');
});

// POST /forum/delete/:id - delete a thread (login + owner required)
router.post('/delete/:id', requireLogin, (req, res) => {
    const threadId = parseInt(req.params.id);
    const thread = threads.find(t => t.id === threadId);
    if (!thread) {
        return res.redirect('/forum');
    }
    const isOwner = thread.author === req.session.user.fullname;
    const isAdmin = req.session.user.username === "admin123";
    if (!isOwner && !isAdmin) {
        return res.redirect('/forum');
    }
    threads = threads.filter(t => t.id !== threadId);
    res.redirect('/forum');
});

// POST /forum/:id/reply - add a reply (login required)
router.post('/:id/reply', requireLogin, (req, res) => {
    const threadId = parseInt(req.params.id);
    const { content } = req.body;
    const thread = threads.find(t => t.id === threadId);

    if (thread && content && content.trim() !== "") {
        thread.repliesList.push({
            id: Date.now(),
            author: req.session.user.fullname,
            content: content,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            deleted: false
        });
    }
    res.redirect('/forum/' + threadId);
});

// POST /forum/:id/reply/:replyId/delete - soft-delete a reply (login + owner required)
router.post('/:id/reply/:replyId/delete', requireLogin, (req, res) => {
    const threadId = parseInt(req.params.id);
    const replyId = parseInt(req.params.replyId);
    const thread = threads.find(t => t.id === threadId);

    if (thread) {
        const reply = thread.repliesList.find(r => r.id === replyId);
        // Only the reply's author can remove it
        if (reply && reply.author === req.session.user.fullname) {
            reply.deleted = true;  // Soft delete - kept in data for auditing
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