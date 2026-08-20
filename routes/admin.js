const express = require('express');
const router = express.Router();

// Middleware - only the admin account may access this area
const requireAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (req.session.user.username !== 'admin123') {
        return res.redirect('/');  // non-admin users are turned away
    }
    next();
};

// GET /admin - user management dashboard (with search, filter, sort)
router.get('/', requireAdmin, (req, res) => {
    let displayUsers = global.users;

    // Search by username or email
    const search = (req.query.q || '').trim().toLowerCase();
    if (search) {
        displayUsers = displayUsers.filter(u =>
            u.username.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
        );
    }

    // Filter by role
    const role = req.query.role || 'all';
    if (role !== 'all') {
        displayUsers = displayUsers.filter(u => u.role === role);
    }

    // Filter by status
    const status = req.query.status || 'all';
    if (status !== 'all') {
        displayUsers = displayUsers.filter(u => u.status === status);
    }

    // Sort
    const sort = req.query.sort || 'joined-desc';
    displayUsers = [...displayUsers].sort((a, b) => {
        if (sort === 'username-asc') {
            return a.username.localeCompare(b.username);
        }
        if (sort === 'joined-asc') {
            return new Date(a.joined) - new Date(b.joined);
        }
        // joined-desc (default)
        return new Date(b.joined) - new Date(a.joined);
    });

    // Stats (from the full list, not filtered)
    const stats = {
        total: global.users.length,
        active: global.users.filter(u => u.status === 'active').length,
        locked: global.users.filter(u => u.status === 'locked').length,
        staff: global.users.filter(u => u.role === 'admin' || u.role === 'moderator').length
    };

    res.render('admin', {
        users: displayUsers,
        stats: stats,
        query: req.query,
        user: req.session.user
    });
});

// POST /admin/lock/:id - lock or unlock a user account
router.post('/lock/:id', requireAdmin, (req, res) => {
    const userId = parseInt(req.params.id);
    const target = global.users.find(u => u.id === userId);
    if (target) {
        // Toggle status
        target.status = target.status === 'locked' ? 'active' : 'locked';
    }
    res.redirect('/admin');
});

// POST /admin/delete/:id - remove a user account
router.post('/delete/:id', requireAdmin, (req, res) => {
    const userId = parseInt(req.params.id);
    // Don't allow deleting the admin's own account here
    if (userId !== req.session.user.id) {
        global.users = global.users.filter(u => u.id !== userId);
    }
    res.redirect('/admin');
});

module.exports = router;
