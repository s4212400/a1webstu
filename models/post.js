const mongoose = require('mongoose');

// Post schema - used for BOTH thread-starting posts and replies.
// A "thread" is a Post with parentThread = null.
// A "reply" is a Post with parentThread pointing back to its thread.
// This matches the brief: threads and replies share the same main data
// (title, content, image, author, timestamp) - a thread just also has a title.
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        // Only required when this post IS a thread (parentThread is null)
        required: function () {
            return this.parentThread == null;
        }
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        minlength: [10, 'Content must be at least 10 characters long']
    },
    imageUrl: {
        type: String,
        default: ''
    },
    // Reference to the user who wrote this post/reply (matches models/reviews.js pattern)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // null = this document is a thread; otherwise it's a reply to that thread
    parentThread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        default: null
    },
    // Soft delete - hidden from public view but kept in DB for auditing (per brief)
    deleted: {
        type: Boolean,
        default: false
    },
    // Only meaningful on thread documents: bumped whenever a new reply is
    // added, so we can sort threads by "most recent post" without a
    // separate aggregation query.
    lastActivityAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // adds createdAt / updatedAt automatically
});

module.exports = mongoose.model('Post', postSchema);
