require('dotenv').config();

const { dbconnect } = require('./config/db');
const Product = require('./models/product');

const products = [
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

async function seedProducts() {
    try {
        await dbconnect(process.env.MONGODB_URI);

        console.log('Seeding products...');

        for (const product of products) {
            await Product.findOneAndUpdate(
                { productId: product.productId },
                product,
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            );
        }

        console.log(`Successfully seeded ${products.length} products.`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error.message);
        process.exit(1);
    }
}

seedProducts();