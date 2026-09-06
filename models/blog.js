const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'], 
        trim: true, 
        minlength: [3, 'Title must be at least 3 characters long'] 
    },
    author: { 
        type: String, 
        required: true, 
        trim: true 
    },
    category: { 
        type: String, 
        required: true, 
        lowercase: true, 
        enum: ['retro', 'hardware', 'esports', 'reviews'] 
    },
    tags: { 
        type: String, 
        trim: true 
    },
    imageUrl: { 
        type: String, 
        required: [true, 'Image URL is required'] 
    },
    content: { 
        type: String, 
        required: [true, 'Content is required'], 
        minlength: [5, 'Content must be at least 5 characters long'] 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Blog', blogSchema);