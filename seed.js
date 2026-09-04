require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Review = require('./models/reviews');
const Blog = require('./models/blog'); 

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        // Clear existing sample data (so re-running doesn't duplicate)
        await User.deleteMany({});
        await Review.deleteMany({});
        await Blog.deleteMany({});
        console.log('Cleared old users, reviews, and blogs');

        // 1. Create users FIRST (reviews need author ids)
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

        // 3. Create sample blogs 
        const blogsData = [
            {
                title: "THE RESURGENCE OF RETRO ARCADE",
                author: "admin123",
                date: "2026-08-20",
                category: "RETRO",
                tags: "arcade, nostalgia, pacman",
                imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
                content: "Arcade cabinets are making a massive comeback this year. From neon-lit bars to home setups, the pixelated glory of the 80s is alive and well. In this databank entry, we explore the best ways to emulate these classic systems."
            },
            {
                title: "NEXT-GEN HARDWARE LEAKS",
                author: "lgminnn",
                date: "2026-08-18",
                category: "HARDWARE",
                tags: "ps6, xbox, rumors",
                imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
                content: "System scans indicate new hardware specifications have been leaked onto the net. Teraflops are doubling, and haptic feedback is evolving. Are we ready for the next tier of virtual immersion?"
            },
            {
                title: "ESPORTS: THE NEW OLYMPICS?",
                author: "Tien Nguyen",
                date: "2026-08-15",
                category: "ESPORTS",
                tags: "tournament, competitive",
                imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
                content: "With prize pools surpassing traditional sports, competitive gaming is no longer a niche. We analyze the latest tournament stats and what it means for the future of digital athletes."
            }
        ];

        await Blog.insertMany(blogsData);
        console.log(`Created ${blogsData.length} blogs`);

        console.log('Seeding complete!');
        await mongoose.connection.close();
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();