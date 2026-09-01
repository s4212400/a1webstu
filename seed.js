// ============================================
// Seed script - inserts sample data into MongoDB
// Run ONCE with: node seed.js
// Creates sample users + reviews (Viet's modules)
// Teammates can add their own collections below.
// ============================================
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Review = require('./models/reviews');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas');

        // Clear existing sample data (so re-running doesn't duplicate)
        await User.deleteMany({});
        await Review.deleteMany({});
        console.log('Cleared old users and reviews');

        // 1. Create users FIRST (reviews need author ids)
        //    Passwords are plain here - the User model hashes them on save.
        //    insertMany skips the pre-save hook, so we create + save individually
        //    to make sure hashing runs.
        const usersData = [
            { fullname: 'Admin Test', username: 'admin123', email: 'admin@gmail.com', password: 'password123', description: 'I am the admin', role: 'admin', status: 'active' },
            { fullname: 'Hoang Nguyen', username: 'hoangn', email: 'hoang@email.com', password: 'password123', description: 'Console gamer', role: 'standard', status: 'active' },
            { fullname: 'Tien Nguyen', username: 'tienn', email: 'tien@email.com', password: 'password123', description: 'Xbox fan', role: 'standard', status: 'active' },
            { fullname: 'Minh Tri', username: 'minhtri', email: 'minhtri@email.com', password: 'password123', description: 'Switch collector', role: 'standard', status: 'active' }
        ];

        const users = [];
        for (const u of usersData) {
            const user = new User(u);
            await user.save();   // .save() triggers password hashing
            users.push(user);
        }
        console.log(`Created ${users.length} users`);

        // 2. Create reviews, linking author to a real user id
        const reviewsData = [
            { title: "Best controller I've owned in a decade", description: "The haptic feedback genuinely changes how combat feels in every game I play.", rating: 5, image: "/images/ps_controller.jpg", author: users[1]._id },
            { title: "Great performance, loud fan under heavy load", description: "Load times are basically gone compared to my old console, but the fan gets noisy.", rating: 4, image: "/images/xbox.jpg", author: users[2]._id },
            { title: "OLED screen is a huge upgrade for handheld mode", description: "Colors are noticeably richer than the original model, a joy for handheld play.", rating: 4, image: "/images/nintendo_oled.jpg", author: users[3]._id },
            { title: "Solid all-round console for the price point", description: "Been using this as my main setup for a month now and it handles everything well.", rating: 5, image: "/images/ps5.jpg", author: users[0]._id }
        ];

        await Review.insertMany(reviewsData);
        console.log(`Created ${reviewsData.length} reviews`);

        console.log('Seeding complete!');
        await mongoose.connection.close();
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();