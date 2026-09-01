const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema - defines the structure of a user document
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    description: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    role: { type: String, default: 'standard' },      // standard | moderator | admin
    status: { type: String, default: 'active' },       // active | locked
    joined: { type: Date, default: Date.now }
});

// Hash the password automatically before saving a new/changed password
userSchema.pre('save', async function () {
    // Only hash if the password field was changed (avoids re-hashing on every save)
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to check a login password against the stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;