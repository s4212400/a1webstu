require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Review = require('./models/reviews');
const Blog = require('./models/blog'); 
const Product = require('./models/product');
const Post = require('./models/post');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        // Clear existing sample data (so re-running doesn't duplicate)
        await User.deleteMany({});
        await Review.deleteMany({});
        await Blog.deleteMany({});
        await Post.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared old users, reviews, blogs, forum, posts, and products');

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
        
        // 2. Create products
        const productsData = [
            {
                productId: 1,
                name: "PlayStation 5 Slim",
                category: "console",
                platform: "ps5",
                image: "/images/ps5.jpg",
                oldPrice: 649.99,
                price: 599.99,
                discount: 8,
                condition: "new",
                rating: 5,
                ratingCount: 1842,
                stock: 24
            },
            {
                productId: 2,
                name: "Xbox Series X",
                category: "console",
                platform: "xbox",
                image: "/images/xbox.jpg",
                price: 549.99,
                condition: "new",
                rating: 4,
                ratingCount: 1205,
                stock: 17
            },
            {
                productId: 3,
                name: "Nintendo Switch OLED",
                category: "console",
                platform: "switch",
                image: "/images/nintendo_oled.jpg",
                oldPrice: 399.99,
                price: 349.99,
                discount: 12,
                condition: "new",
                rating: 5,
                ratingCount: 2310,
                stock: 4
            },
            {
                productId: 4,
                name: "DualSense Wireless Controller",
                category: "accessory",
                platform: "ps5",
                image: "/images/ps_controller.jpg",
                price: 74.99,
                condition: "new",
                rating: 4,
                ratingCount: 864,
                stock: 52
            },
            {
                productId: 5,
                name: "Pulse 3D Wireless Headset",
                category: "accessory",
                platform: "ps5",
                image: "/images/pulse_headset.jpg",
                oldPrice: 99.99,
                price: 79.99,
                discount: 20,
                condition: "new",
                rating: 4,
                ratingCount: 731,
                stock: 33
            },
            {
                productId: 6,
                name: "Zelda: Tears of the Kingdom",
                category: "game",
                platform: "switch",
                image: "/images/zelda_totk.jpg",
                oldPrice: 69.99,
                price: 54.99,
                discount: 20,
                condition: "new",
                rating: 5,
                ratingCount: 2481,
                stock: 41
            },
            {
                productId: 7,
                name: "Marvel's Spider-Man 2",
                category: "game",
                platform: "ps5",
                image: "/images/spiderman2.jpg",
                oldPrice: 69.99,
                price: 49.99,
                discount: 30,
                condition: "new",
                rating: 5,
                ratingCount: 3107,
                stock: 6
            },
            {
                productId: 8,
                name: "Mario Kart 8 Deluxe",
                category: "game",
                platform: "switch",
                image: "/images/mario_kart.jpg",
                price: 59.99,
                condition: "new",
                rating: 5,
                ratingCount: 5092,
                stock: 68
            },
            {
                productId: 9,
                name: "Astro Bot",
                category: "game",
                platform: "ps5",
                image: "/images/astrobot.jpg",
                price: 59.99,
                condition: "new",
                rating: 5,
                ratingCount: 2754,
                stock: 37
            },
            {
                productId: 10,
                name: "Cyberpunk 2077: Ultimate",
                category: "game",
                platform: "ps5",
                image: "/images/cyberpunk.jpg",
                oldPrice: 79.99,
                price: 49.99,
                discount: 38,
                condition: "new",
                rating: 4,
                ratingCount: 3918,
                stock: 28
            },
            {
                productId: 11,
                name: "Elden Ring",
                category: "game",
                platform: "ps5",
                image: "/images/eldenring.jpg",
                oldPrice: 59.99,
                price: 39.99,
                discount: 35,
                condition: "new",
                rating: 5,
                ratingCount: 4265,
                stock: 0
            },
            {
                productId: 12,
                name: "Animal Crossing: New Horizons",
                category: "game",
                platform: "switch",
                image: "/images/animalcrossing.jpg",
                price: 42.99,
                condition: "new",
                rating: 5,
                ratingCount: 6102,
                stock: 55
            },
            {
                productId: 13,
                name: "Kirby's Return to Dream Land",
                category: "game",
                platform: "switch",
                image: "/images/kirby.jpg",
                oldPrice: 49.99,
                price: 39.99,
                discount: 20,
                condition: "new",
                rating: 4,
                ratingCount: 1486,
                stock: 22
            },
            {
                productId: 14,
                name: "Persona 3 Reload",
                category: "game",
                platform: "ps5",
                image: "/images/persona3.jpg",
                price: 49.99,
                condition: "new",
                rating: 5,
                ratingCount: 2047,
                stock: 5
            },
            {
                productId: 15,
                name: "Metaphor: ReFantazio",
                category: "game",
                platform: "ps5",
                image: "/images/metaphor.jpg",
                price: 59.99,
                condition: "new",
                rating: 5,
                ratingCount: 1733,
                stock: 19
            },
            {
                productId: 16,
                name: "Gran Turismo 7: BMW Pack",
                category: "game",
                platform: "ps5",
                image: "/images/bmw.jpg",
                oldPrice: 89.99,
                price: 69.99,
                discount: 22,
                condition: "new",
                rating: 4,
                ratingCount: 942,
                stock: 3
            },
            {
                productId: 17,
                name: "Nintendo Switch Lite",
                category: "console",
                platform: "switch",
                image: "/images/nintendo_2.jpg",
                price: 219.99,
                condition: "new",
                rating: 4,
                ratingCount: 3201,
                stock: 31
            },
            {
                productId: 18,
                name: "Switch Pro Controller",
                category: "accessory",
                platform: "switch",
                image: "/images/nin_controller.jpg",
                oldPrice: 79.99,
                price: 64.99,
                discount: 19,
                condition: "new",
                rating: 5,
                ratingCount: 2588,
                stock: 44
            },
            {
                productId: 19,
                name: "DualSense Charging Station",
                category: "accessory",
                platform: "ps5",
                image: "/images/ps_charging_dock.jpg",
                price: 34.99,
                condition: "new",
                rating: 4,
                ratingCount: 671,
                stock: 60
            },
            {
                productId: 20,
                name: "Super Mario Bros Wonder",
                category: "game",
                platform: "switch",
                image: "/images/mario.jpg",
                oldPrice: 59.99,
                price: 44.99,
                discount: 25,
                condition: "new",
                rating: 5,
                ratingCount: 1932,
                stock: 26
            }
        ];

        const products = await Product.insertMany(productsData);
        console.log(`Created ${productsData.length} products`);

        // 3. Create reviews, linking author to a real user id
        const reviewsData = [
            { title: "Best controller I've owned in a decade", description: "The haptic feedback genuinely changes how combat feels in every game I play.", rating: 5, image: "/images/ps_controller.jpg", author: users[1]._id, product: products[3]._id },
            { title: "Great performance, loud fan under heavy load", description: "Load times are basically gone compared to my old console, but the fan gets noisy.", rating: 4, image: "/images/xbox.jpg", author: users[2]._id, product: products[1]._id },
            { title: "OLED screen is a huge upgrade for handheld mode", description: "Colors are noticeably richer than the original model, a joy for handheld play.", rating: 4, image: "/images/nintendo_oled.jpg", author: users[3]._id, product: products[2]._id },
            { title: "Solid all-round console for the price point", description: "Been using this as my main setup for a month now and it handles everything well.", rating: 5, image: "/images/ps5.jpg", author: users[0]._id, product: products[0]._id }
        ];

        await Review.insertMany(reviewsData);
        console.log(`Created ${reviewsData.length} reviews`);

        // 4. Create sample blogs 
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

        // 4. Create forum threads + replies, carried over from the original
        //    in-memory sample data in routes/forum.js, mapped onto real users.
        // users[0]=Admin Test, users[1]=Hoang Nguyen, users[2]=Tien Nguyen, users[3]=Minh Tri
        const threadsData = [
            {
                title: "[Rules] Official Ranked Match Settings - Read Before Posting",
                content: "Pinning this so new members can check the approved settings for ranked lobbies before they start a dispute thread. Please read fully before posting a complaint.",
                author: users[0]._id,
                createdAt: new Date("Jul 02, 2026"),
                replies: [
                    { author: users[1]._id, content: "Thanks for pinning this, saved me from starting a duplicate thread.", createdAt: new Date("Jul 03, 2026") },
                    { author: users[2]._id, content: "Can we get the turbo-button rule clarified? It is still ambiguous for fighting games.", createdAt: new Date("Jul 04, 2026") },
                    { author: users[3]._id, content: "Agreed, the macro rule needs an example. Otherwise great writeup.", createdAt: new Date("Jul 05, 2026") },
                    { author: users[0]._id, content: "Updated the post with a turbo-button example. Let me know if anything is still unclear.", createdAt: new Date("Jul 06, 2026") }
                ]
            },
            {
                title: "Best DualSense button remap for fighting games?",
                content: "I keep fumbling the special-move inputs with the default layout. What remap are you all using for combos?",
                author: users[1]._id,
                createdAt: new Date("Jul 20, 2026"),
                replies: [
                    { author: users[2]._id, content: "I swap L1/R1 to the shoulder triggers and keep the special-move button on the touchpad click.", createdAt: new Date("Jul 20, 2026") },
                    { author: users[3]._id, content: "Lowering the trigger dead-zone in the accessibility settings helps a lot with quarter circles.", createdAt: new Date("Jul 20, 2026") },
                    { author: users[0]._id, content: "Touchpad-click for supers is underrated. Been using it for months without issues.", createdAt: new Date("Jul 21, 2026") },
                    { author: users[0]._id, content: "Reminder: remaps are allowed in ranked as long as you don't use turbo. See the rules thread.", createdAt: new Date("Jul 21, 2026") },
                    { author: users[2]._id, content: "Good point, updated my layout to stay compliant. Thanks!", createdAt: new Date("Jul 22, 2026") }
                ]
            },
            {
                title: "Switch OLED vs handheld PC for co-op strategy games",
                content: "Trying to decide which is better for couch co-op sessions with friends. Any experiences to share?",
                author: users[3]._id,
                createdAt: new Date("Jul 15, 2026"),
                replies: [
                    { author: users[1]._id, content: "OLED wins for pure couch co-op — the kickstand and detachable joycons make it effortless.", createdAt: new Date("Jul 15, 2026") },
                    { author: users[0]._id, content: "Handheld PC is more flexible but battery life tanks with two controllers connected.", createdAt: new Date("Jul 16, 2026") },
                    { author: users[2]._id, content: "If you already own a dock, the OLED is the easier recommendation for guests.", createdAt: new Date("Jul 16, 2026") }
                ]
            }
        ];

        let postCount = 0;
        for (const t of threadsData) {
            const lastReplyDate = t.replies.length > 0 ? t.replies[t.replies.length - 1].createdAt : t.createdAt;

            const thread = new Post({
                title: t.title,
                content: t.content,
                author: t.author,
                parentThread: null,
                createdAt: t.createdAt,
                lastActivityAt: lastReplyDate
            });
            await thread.save();
            postCount++;

            for (const r of t.replies) {
                const reply = new Post({
                    content: r.content,
                    author: r.author,
                    parentThread: thread._id,
                    createdAt: r.createdAt
                });
                await reply.save();
                postCount++;
            }
        }
        console.log(`Created ${threadsData.length} forum threads (${postCount} posts total, including replies)`);

        console.log('Seeding complete!');
        await mongoose.connection.close();
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();