const express = require('express');
const router = express.Router();
const User = require('../models/user');   

// Middleware - only the admin account may access this area
const requireAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (req.session.user.username !== 'admin123') {
        return res.redirect('/');
    }
    next();
};

// GET /admin - user management dashboard (search, filter, sort from MongoDB)
router.get('/', requireAdmin, async (req, res) => {
    try {
        // Build a MongoDB query object from the filters
        const query = {};

        // Search by username OR email (case-insensitive regex)
        const search = (req.query.q || '').trim();
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by role
        const role = req.query.role || 'all';
        if (role !== 'all') {
            query.role = role;
        }

        // Filter by status
        const status = req.query.status || 'all';
        if (status !== 'all') {
            query.status = status;
        }

        // Sort option
        let sortObj = { joined: -1 };  // newest first (default)
        const sort = req.query.sort || 'joined-desc';
        if (sort === 'username-asc') sortObj = { username: 1 };
        else if (sort === 'joined-asc') sortObj = { joined: 1 };

        // Query users with filters + sort
        const displayUsers = await User.find(query).sort(sortObj);

        // Stats from the FULL collection (not filtered)
        const allUsers = await User.find();
        const stats = {
            total: allUsers.length,
            active: allUsers.filter(u => u.status === 'active').length,
            locked: allUsers.filter(u => u.status === 'locked').length,
            staff: allUsers.filter(u => u.role === 'admin' || u.role === 'moderator').length
        };

        res.render('admin', {
            users: displayUsers,
            stats: stats,
            query: req.query,
            user: req.session.user
        });
    } catch (err) {
        console.error(err.message);
        res.redirect('/');
    }
});

// POST /admin/lock/:id - lock or unlock a user account
router.post('/lock/:id', requireAdmin, async (req, res) => {
    try {
        const target = await User.findById(req.params.id);
        if (target) {
            target.status = target.status === 'locked' ? 'active' : 'locked';
            await target.save();
        }
        res.redirect('/admin');
    } catch (err) {
        console.error(err.message);
        res.redirect('/admin');
    }
});

// POST /admin/delete/:id - remove a user account
router.post('/delete/:id', requireAdmin, async (req, res) => {
    try {
        // Don't allow the admin to delete their own account here
        if (req.params.id !== req.session.user._id.toString()) {
            await User.deleteOne({ _id: req.params.id });
        }
        res.redirect('/admin');
    } catch (err) {
        console.error(err.message);
        res.redirect('/admin');
    }
});

module.exports = router;